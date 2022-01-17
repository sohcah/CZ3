import { prisma } from "../prisma";
import { ShadowPlayerActivityLoader, ShadowPlayerReference } from "./player";
import dayjs, { Dayjs } from "dayjs";
import { GameID } from "@cuppazee/utils";
import { shadow_player_task_day } from "@prisma/client";
import { defaultSum, taskCalculations } from "./tasks";

export interface ShadowPlayerTaskReference extends ShadowPlayerReference {
  task_id: number;
}

function getDatesForGameID(gameId: GameID, excludeFutureDates: boolean = true): Dayjs[] {
  const dates = [];

  for (let i = 3; i <= 31; i++) {
    const date = dayjs(0).year(gameId.year).month(gameId.month).date(i);
    if (date.month() !== gameId.month) break;
    if (excludeFutureDates && date.valueOf() > dayjs.mhqNow().valueOf()) break;
    dates.push(date);
  }

  return dates;
}

export async function getShadowPlayerTask(ref: ShadowPlayerTaskReference, activityLoader: ShadowPlayerActivityLoader) {
  const task = await prisma.shadow_player_task.findUnique({
    where: {
      user_id_game_id_task_id: {
        user_id: ref.user_id,
        game_id: ref.game_id,
        task_id: ref.task_id,
      },
    },
    include: {
      shadow_player_task_day: true,
    },
  });

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

  const taskDays = await Promise.all(
    dates.map(async (date): Promise<[taskDay: shadow_player_task_day, status: 0 | 1 | 2]> => {
      const existingData = task?.shadow_player_task_day.find(
        d => dayjs(d.date).format("YYYYMMDD") === date.format("YYYYMMDD")
      );

      if (existingData?.finalised) {
        return [existingData, 0];
      }

      let value = null;
      try {
        const taskCalculator = taskCalculations[ref.task_id];

        if (!taskCalculator) throw "No task calculator";

        const activityData = await activityLoader.get(date.format("YYYY-MM-DD"));

        value = taskCalculator.calculate(activityData);
      } catch {}

      const newData = {
        user_id: ref.user_id,
        game_id: ref.game_id,
        task_id: ref.task_id,
        date: date.toDate(),
        value,
        finalised:
          dayjs.mhqNow().valueOf() >= date.add(1, "day").valueOf(),
      };

      return [newData, existingData ? 1 : 2];
    })
  );

  await Promise.all(taskDays.map(async taskDay => {
    if (taskDay[1] !== 0) {
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
  }));

  const taskCalculator = taskCalculations[ref.task_id];

  if (!taskCalculator) return null;

  return (taskCalculator.sum ?? defaultSum)(taskDays.map(d => d[0]));
}
