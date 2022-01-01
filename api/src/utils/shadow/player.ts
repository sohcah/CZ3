import { authenticateWithUserID, AuthenticationResult } from "../auth";
import { munzeeFetch } from "../munzee";
import { getShadowPlayerTask } from "./task";
import { ActivityData, addActivityItemExtras } from "./tasks";

export interface ShadowPlayerReference {
  user_id: number;
  game_id: number;
}

const tasksByGameId: { [game_id: number]: number[] } = {
  105: [1, 10, 13, 19, 24, 36, 3, 30, 35, 37, 12, 26, 28, 31],
  106: [1, 2, 6, 12, 24, 28, 30, 35, 36, 37, 5038, 4038, 3038, 2038, 3, 13, 14, 26, 34],
};

export async function getShadowPlayerStats(player: ShadowPlayerReference) {
  const tasksOutput: { [task_id: number]: number | null } = {};

  const token = await authenticateWithUserID(player.user_id);
  const activityLoader = new ShadowPlayerActivityLoader(token);
  await Promise.all(tasksByGameId[player.game_id].map(async task_id => {
    tasksOutput[task_id] = await getShadowPlayerTask({ ...player, task_id }, activityLoader)
  }));
  return tasksOutput;
}

export class ShadowPlayerActivityLoader {
  cache = new Map<string, Promise<ActivityData>>();
  token: AuthenticationResult;

  constructor(token: AuthenticationResult) {
    this.token = token;
  }

  private async internalGet(day: string): Promise<ActivityData> {
    console.log("Getting activity for " + day);
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