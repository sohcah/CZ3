import { prisma } from "../prisma";
import { ShadowPlayerActivityLoader, ShadowPlayerReference } from "./player";
import dayjs, { Dayjs } from "dayjs";
import { GameID } from "@cuppazee/utils";
import { shadow_player_task, shadow_player_task_day } from "@prisma/client";
import { defaultSum, taskCalculations } from "./tasks";

export interface ShadowPlayerTaskReference extends ShadowPlayerReference {
  task_id: number;
  task?: shadow_player_task & {shadow_player_task_day: shadow_player_task_day[]};
}

const datesCache = new Map<string, Dayjs[]>();

export function getDatesForGameID(gameId: GameID, excludeFutureDates: boolean = true): Dayjs[] {
  const key = `${gameId}-${excludeFutureDates}-${dayjs.mhqNow().format("DDMMYYYY")}`;
  if (datesCache.has(key)) {
    return datesCache.get(key)!;
  }
  const dates = [];

  for (let i = 3; i <= 31; i++) {
    const date = dayjs.mhqParse(0).year(gameId.year).month(gameId.month).date(i);
    if (date.month() !== gameId.month) break;
    if (excludeFutureDates && date.valueOf() > dayjs.mhqNow().valueOf()) break;
    dates.push(date);
  }

  datesCache.set(key, dates);

  return dates;
}

export async function getShadowPlayerTask(ref: ShadowPlayerTaskReference, activityLoader: ShadowPlayerActivityLoader) {
  const task = ref.task;

  if (!task) {
    await prisma.shadow_player_task.create({
      data: {
        user_id: ref.user_id,
        game_id: ref.game_id,
        task_id: ref.task_id,
      }
    });
  }

  const gameId = new GameID(ref.game_id);

  const dates = getDatesForGameID(gameId);
  // const dates: Dayjs[] = [];

  const task_dayByDate = task?.shadow_player_task_day.reduce((acc, i) => {
    acc[dayjs(i.date).format("YYYYMMDD")] = i;
    return acc;
  }, {} as { [date: string]: shadow_player_task_day });

  let hasAnyChangesAtAll = false;

  const taskDays = await Promise.all(
    dates.map(async (date): Promise<[taskDay: shadow_player_task_day, hasAnyChanges: boolean]> => {
      const existingData = task_dayByDate?.[date.format("YYYYMMDD")];

      if (existingData?.finalised) {
        return [existingData, false];
      }

      let value = null;
      let calculatedValue = false;
      
      let hasAnyChanges = false;
      try {
        const taskCalculator = taskCalculations[ref.task_id % 1000];

        if (!taskCalculator) {
          throw new Error(`No task calculator for ${ref.task_id}`);
        }

        const activityData = await activityLoader.get(date.format("YYYY-MM-DD"));

        value = taskCalculator.calculate(activityData, ref.task_id);
        if (value !== existingData?.value) hasAnyChanges = true;
        calculatedValue = true;
      } catch { }


      const willBeFinalised =
        dayjs.mhqNow().add(-1, "hour").startOf("day").valueOf() >= date.add(1, "day").valueOf() &&
        calculatedValue;
      
      if (willBeFinalised) hasAnyChanges = true;

      if(hasAnyChanges) hasAnyChangesAtAll = true;

      const newData = {
        user_id: ref.user_id,
        game_id: ref.game_id,
        task_id: ref.task_id,
        date: date.toDate(),
        value,
        finalised: willBeFinalised,
      };

      return [newData, hasAnyChanges];
    })
  );

  if (hasAnyChangesAtAll)
    await Promise.all(
      taskDays.map(async taskDay => {
        if (taskDay[1] && (taskDay[0].finalised === true || taskDay[0].value !== null)) {
          await prisma.shadow_player_task_day.upsert({
            where: {
              user_id_game_id_task_id_date: {
                user_id: ref.user_id,
                game_id: ref.game_id,
                task_id: ref.task_id,
                date: taskDay[0].date,
              },
            },
            create: taskDay[0],
            update: taskDay[0],
          });
        }
      })
    );

  const taskCalculator = taskCalculations[ref.task_id % 1000];

  if (!taskCalculator) return null;

  return (taskCalculator.sum ?? defaultSum)(taskDays.map(d => d[0]), ref.task_id);
}
