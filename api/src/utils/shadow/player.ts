import { authenticateWithUserID, AuthenticationResult } from "../auth";
import { munzeeFetch } from "../munzee";
import { getShadowPlayerTask } from "./task";
import { ActivityData, addActivityItemExtras } from "./tasks";
import { prisma } from "../prisma";
import { shadow_player, shadow_player_task, shadow_player_task_day } from "@prisma/client";

export interface ShadowPlayerReference {
  user_id: number;
  game_id: number;
  shadowPlayer?: shadow_player & {
    shadow_player_task: (shadow_player_task & {
      shadow_player_task_day: shadow_player_task_day[];
    })[];
  };
}

const tasksByGameId: { [game_id: number]: number[] } = {
  105: [1, 10, 13, 19, 24, 36, 3, 30, 35, 37, 12, 26, 28, 31],
  106: [1, 2, 6, 12, 24, 28, 30, 35, 36, 37, 5038, 4038, 3038, 2038, 3, 13, 14, 26, 34],
};

export async function getShadowPlayerStats(player: ShadowPlayerReference) {
  const tasksOutput: { [task_id: number]: number | null } = {};

  const token = await authenticateWithUserID(player.user_id);

  const shadowPlayer = player.shadowPlayer ?? await prisma.shadow_player.findUnique({
    where: {
      user_id_game_id: {
        user_id: player.user_id,
        game_id: player.game_id,
      },
    },
    include: {
      shadow_player_task: {
        include: {
          shadow_player_task_day: true,
        },
      },
    },
  });

  if (!shadowPlayer) {
    await prisma.shadow_player.create({
      data: {
        user_id: player.user_id,
        game_id: player.game_id,
      },
    });
  }

  const activityLoader = new ShadowPlayerActivityLoader(token);
  activityLoader.user_id = shadowPlayer?.user_id;
  await Promise.all(
    tasksByGameId[player.game_id].map(async task_id => {
      tasksOutput[task_id] = await getShadowPlayerTask(
        {
          ...player,
          task: shadowPlayer?.shadow_player_task.find(i => i.task_id === task_id),
          task_id,
        },
        activityLoader
      );
    })
  );
  return tasksOutput;
}

export class ShadowPlayerActivityLoader {
  cache = new Map<string, Promise<ActivityData>>();
  token: AuthenticationResult;
  user_id?: number;

  constructor(token: AuthenticationResult) {
    this.token = token;
  }

  private async internalGet(day: string): Promise<ActivityData> {
    console.log(`Getting activity for ${day} for ${this.user_id}`);
    const activityResponse = await munzeeFetch({
      endpoint: "statzee/player/day",
      params: {
        day,
      },
      token: this.token,
    });
    const activityData = await activityResponse.getMunzeeData();

    if (!activityData.data) throw "No data";

    return {
      captures: addActivityItemExtras(activityData.data.captures),
      deploys: addActivityItemExtras(activityData.data.deploys),
      captures_on: addActivityItemExtras(activityData.data.captures_on),
    };
  }

  get(day: string): Promise<ActivityData> {
    if (!this.cache.has(day)) {
      this.cache.set(day, this.internalGet(day));
    }
    return this.cache.get(day)!;
  }
}
