import {
  authenticateAnonymous,
  authenticateWithUserID,
  AuthenticationResult,
} from "../auth/index.js";
import { munzeeFetch } from "../munzee.js";
import { getShadowPlayerTask } from "./task.js";
import { ActivityData, addActivityItemExtras } from "./tasks.js";
import { prisma } from "../prisma.js";
import { shadow_player, shadow_player_task, shadow_player_task_day } from "@cz3/prisma";
import { rollbar } from "../../extra/rollbar.js";
import { Cacher } from "../cacher.js";

export interface ShadowPlayerReference {
  user_id: number;
  game_id: number;
  shadowPlayer?: shadow_player & {
    shadow_player_task: (shadow_player_task & {
      shadow_player_task_day: shadow_player_task_day[];
    })[];
  };
}

function getCuppaZeeTaskId(task: { task_id: number; name: string }) {
  const n = Number(task.name.match(/with ([0-9]+),000 Points/i)?.[1]);
  if (Number(task.task_id) === 38) {
    return n * 1000 + Number(task.task_id);
  }
  return Number(task.task_id);
}

const tasksByGameId = new Cacher(async (game_id: number) => {
  try {
    const token = await authenticateAnonymous();
    const response = await munzeeFetch({
      endpoint: "clan/v2/requirements",
      params: {
        clan_id: 2041,
        game_id,
      },
      token,
    });
    const data = await response.getMunzeeData();
    return [
      ...new Set(
        Object.values(data.data?.data.levels ?? {}).flatMap(i => [
          ...i.individual.map(i => getCuppaZeeTaskId(i)),
          ...i.group.map(i => getCuppaZeeTaskId(i)),
        ])
      ),
    ];
  } catch {
    return null;
  }
}, 1000 * 60 * 60 * 24);

// const tasksByGameId: { [game_id: number]: number[] } = {
//   105: [1, 10, 13, 19, 24, 36, 3, 30, 35, 37, 12, 26, 28, 31],
//   106: [1, 2, 6, 12, 24, 28, 30, 35, 36, 37, 5038, 4038, 3038, 2038, 3, 13, 14, 26, 34],
//   107: [1, 2, 6, 13, 19, 24, 35, 10038, 8038, 6038, 5038, 3038, 3, 37, 27, 26, 28, 29, 32, 36],
//   108: [1, 2, 6, 7, 13, 24, 8038, 7038, 5038, 4038, 3038, 3, 17, 30, 35, 37, 26, 28, 33, 36],
//   109: [1, 2, 6, 13, 24, 34, 36, 8038, 6038, 4038, 3038, 3, 35, 37, 12, 14, 26, 28, 30, 31],
//   110: [1, 2, 6, 13, 24, 28, 30, 8038, 6038, 4038, 3038, 3, 27, 35, 37, 7, 19, 26, 29, 36],
//   111: [1, 2, 6, 13, 17, 24, 31, 8038, 6038, 4038, 3038, 3, 35, 37, 14, 26, 28, 30, 36],
//   112: [1, 2, 6, 7, 13, 24, 36, 8038, 6038, 4038, 3038, 3, 35, 37, 26, 28, 30, 32, 34],
//   113: [1, 2, 6, 13, 14, 24, 29, 6038, 5038, 4038, 3038, 2038, 1038, 3, 35, 37, 17, 26, 28, 30, 36],
// };

export async function getShadowPlayerStats(player: ShadowPlayerReference) {
  const tasksOutput: { [task_id: number]: number | null } = {};

  const shadowPlayer =
    player.shadowPlayer ??
    (await (() => {
      return prisma.shadow_player.findUnique({
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
    })());

  if (!shadowPlayer) {
    await prisma.shadow_player.create({
      data: {
        user_id: player.user_id,
        game_id: player.game_id,
      },
    });
  }

  let gameIdTasks = await tasksByGameId.get(player.game_id);

  if (!gameIdTasks) {
    console.error(`[IMPORTANT] No tasks for game ${player.game_id}`);
    rollbar?.error(`[IMPORTANT] No tasks for game ${player.game_id}`);
    gameIdTasks = [];
  }

  const activityLoader = new ShadowPlayerActivityLoader(player.user_id);
  await Promise.all(
    gameIdTasks.map(async task_id => {
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
  token?: AuthenticationResult;
  user_id: number;

  async getToken() {
    if (!this.token) {
      this.token = await authenticateWithUserID(this.user_id);
    }
    return this.token;
  }

  constructor(user_id: number) {
    this.user_id = user_id;
  }

  private async internalGet(day: string): Promise<ActivityData> {
    const activityResponse = await munzeeFetch({
      endpoint: "statzee/player/day",
      params: {
        day,
      },
      token: await this.getToken(),
    });
    const activityData = await activityResponse.getMunzeeData();

    if (!activityData.data) throw "No data";

    return {
      captures: addActivityItemExtras([
        ...activityData.data.captures,
        // @ts-expect-error passive_captures isn't in the API types data yet
        ...(activityData.data.passive_captures ?? []),
      ]),
      deploys: addActivityItemExtras([
        ...activityData.data.deploys,
        // @ts-expect-error passive_deploys isn't in the API types data yet
        ...(activityData.data.passive_deploys ?? []),
      ]),
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
