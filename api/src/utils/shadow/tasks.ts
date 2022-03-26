import { StatzeePlayerDay } from "@cuppazee/api/statzee/player/day";
import { shadow_player_task_day } from "@prisma/client";
import { Type, TypeState, TypeTags } from "@cuppazee/db";
import { dbCache } from "../meta";

type BaseActivityData = NonNullable<StatzeePlayerDay["response"]["data"]>;
export type ActivityItemExtras = {
  type?: Type;
};
export type ActivityData = {
  captures: (BaseActivityData["captures"][number] & ActivityItemExtras)[];
  captures_on: (BaseActivityData["captures_on"][number] & ActivityItemExtras)[];
  deploys: (BaseActivityData["deploys"][number] & ActivityItemExtras)[];
};
export function addActivityItemExtras<T extends { pin: string }>(items: T[]): (T & ActivityItemExtras)[] {
  return items.map(item => ({
    ...item,
    type: dbCache.value.getType(item.pin) ?? undefined,
  }));
}

type ActivityItem =
  | ActivityData["captures"][number]
  | ActivityData["captures_on"][number]
  | ActivityData["deploys"][number];
export type TaskSumFunction = (days: shadow_player_task_day[], task_id: number) => number | null;
export type TaskCalculateFunction = (data: ActivityData, task_id: number) => number | null;
export type BasicTaskCalculateFunctionGenerator = (
  func: (data: ActivityData) => ActivityItem[]
) => TaskCalculateFunction;

export interface TaskCalculator {
  task_id: number;
  calculate: TaskCalculateFunction;
  sum?: TaskSumFunction;
}

export const defaultSum: TaskSumFunction = days => {
  return days.reduce<number | null>((a, b) => {
    if (a === null || b.value === null) return null;
    return a + b.value;
  }, 0);
};

const calculatePoints = (data: ActivityItem[]): number => {
  return data.reduce<number>((a, b) => {
    if ("points_for_creator" in b) {
      return a + Number(b.points_for_creator);
    }
    return a + Number(b.points);
  }, 0);
}

const points: BasicTaskCalculateFunctionGenerator = func => {
  return items =>
    calculatePoints(func(items));
};

const count: BasicTaskCalculateFunctionGenerator = func => {
  return items => func(items).length;
};

export const taskCalculations: { [task_id: number]: TaskCalculator } = {
  1: {
    task_id: 1,
    calculate: ({ captures, deploys }) =>
      [...captures, ...deploys].filter(i => {
        if (i.type?.has_tag(TypeTags.TypePersonal)) return false;
        if (i.type?.has_tag(TypeTags.TypeUniversal)) return false;
        if (!("captured_at" in i) && i.type?.has_tag(TypeTags.Scatter)) return false;
        return true;
      }).length > 0
        ? 1
        : 0,
  },

  2: {
    task_id: 2,
    calculate: count(({ captures }) => captures),
  },
  3: {
    task_id: 3,
    calculate: points(({ captures, deploys, captures_on }) => [...captures, ...deploys, ...captures_on]),
  },
  6: {
    task_id: 6,
    calculate: count(({ deploys }) => [...deploys]
        .filter(
          i =>
            !i.type?.has_tag(TypeTags.TypePersonal) &&
            !i.type?.has_tag(TypeTags.TypeUniversal) &&
            !i.type?.has_tag(TypeTags.Scatter)
        )),
  },
  7: {
    task_id: 7,
    calculate: points(({ captures, deploys, captures_on }) =>
      [...captures, ...deploys, ...captures_on]
        .filter(i => i.type?.has_tag(TypeTags.TypeDestination))),
  },
  8: {
    task_id: 8,
    calculate: points(({ captures, deploys, captures_on }) =>
      [...captures, ...deploys, ...captures_on].filter(i => i.type?.state === TypeState.Physical)),
  },
  9: {
    task_id: 9,
    calculate: count(({ captures }) => captures.filter((i: any) => i.type?.icon === "munzee")),
  },
  10: {
    task_id: 10,
    calculate: points(({ deploys }) =>
      deploys
        .filter(
          (i: any) =>
            !i.type?.has_tag(TypeTags.TypePersonal) &&
            !i.type?.has_tag(TypeTags.TypeUniversal) &&
            !i.type?.has_tag(TypeTags.Scatter)
        )),
  },
  11: {
    task_id: 11,
    calculate: points(({ captures }) => captures),
  },
  12: {
    task_id: 12,
    calculate: points(({ captures, deploys, captures_on }) =>
      [...captures, ...deploys, ...captures_on].filter(i => i.type?.has_tag(TypeTags.Evolution))),
  },
  13: {
    task_id: 13,
    calculate: count(({ captures }) => captures.filter((i: any) => i.type?.has_tag(TypeTags.TypePOI))),
  },
  14: {
    task_id: 14,
    calculate: count(({ captures, deploys }) =>
      [...deploys, ...captures].filter(i => i.type?.has_tag(TypeTags.TypeJewel))),
  },
  17: {
    task_id: 17,
    calculate: count(({ captures, deploys }) =>
      [...deploys, ...captures].filter(i => i.type?.has_tag(TypeTags.Evolution))),
  },
  19: {
    task_id: 19,
    calculate: points(({ captures, deploys, captures_on }) =>
      [...captures, ...deploys, ...captures_on].filter(i => i.type?.has_tag(TypeTags.TypeJewel))),
  },
  22: {
    task_id: 22,
    calculate: count(({ captures, deploys }) => [...captures, ...deploys].filter(i => i.type?.icon === "urbanfit")),
  },
  23: {
    task_id: 23,
    calculate: points(({ captures, deploys, captures_on }) =>
      [...captures, ...deploys, ...captures_on]
        .filter(i => i.type?.has_tag(TypeTags.TypeWeaponClan) || i.type?.icon === "trojanunicorn")),
  },
  24: {
    task_id: 24,
    calculate: count(({ captures }) => captures.filter((i: any) => i.type?.has_tag(TypeTags.Bouncer))),
  },
  25: {
    task_id: 25,
    calculate: count(({ captures, deploys }) =>
      [...captures, ...deploys].filter(i => i.type?.has_tag(TypeTags.TypeMystery))),
  },
  26: {
    task_id: 26,
    calculate: count(({ captures, deploys }) =>
      [...captures, ...deploys].filter(
        i => i.type?.has_tag(TypeTags.TypeWeaponClan) || i.type?.icon === "trojanunicorn"
      )),
  },
  27: {
    task_id: 27,
    calculate: count(({ captures, deploys }) =>
      [...captures, ...deploys].filter(i => i.type?.has_tag(TypeTags.TypeZodiac) && !i?.type.has_tag(TypeTags.Scatter))),
  },
  28: {
    task_id: 28,
    calculate: points(({ captures, deploys, captures_on }) =>
      [...captures, ...deploys, ...captures_on].filter(i => i.type?.has_tag(TypeTags.TypeFlat))),
  },
  29: {
    task_id: 29,
    calculate: points(({ captures, deploys, captures_on }) =>
      [...captures, ...deploys, ...captures_on]
        .filter(
          i =>
            (i.type?.has_tag(TypeTags.TypeMysteryElemental) && !i.type?.has_tag(TypeTags.Scatter)) ||
            ["fire", "waterdroplet", "frozengreenie", "charge"].includes(i.type?.icon || "")
        )),
  },
  30: {
    task_id: 30,
    calculate: count(({ captures, deploys }) =>
      [...captures, ...deploys].filter(
        i =>
          i.type?.has_tag(TypeTags.TypeReseller) &&
          !i.type?.has_tag(TypeTags.Scatter) &&
          !i.type?.has_tag(TypeTags.Bouncer)
      )),
  },
  31: {
    task_id: 31,
    calculate: points(({ captures, deploys, captures_on }) =>
      [...captures, ...deploys, ...captures_on].filter(i => i.type?.has_tag(TypeTags.TypeGaming))),
  },
  32: {
    task_id: 32,
    calculate: count(({ captures, deploys }) =>
      [...captures, ...deploys].filter(i => i.type?.has_tag(TypeTags.TypeGaming))),
  },
  33: {
    task_id: 33,
    calculate: count(({ captures }) => captures.filter((i: any) => i.type?.icon === "renovation")),
  },
  34: {
    task_id: 34,
    calculate: points(({ captures, deploys, captures_on }) =>
      [...captures, ...deploys, ...captures_on].filter(i => i.type?.has_tag(TypeTags.TypeMystery))),
  },
  35: {
    task_id: 35,
    calculate: ({ captures }) =>
      captures.filter((i: any) => i.type?.icon === "qrewzee" || i.type?.icon === "sleepzee").length,
  },
  36: {
    task_id: 36,
    calculate: points(({ captures, deploys, captures_on }) =>
      [...captures, ...deploys, ...captures_on].filter(i => i.type?.has_tag(TypeTags.Card))),
  },
  37: {
    task_id: 37,
    calculate: () => null,
    sum: () => null,
  },
  38: {
    task_id: 38,
    calculate: ({ captures, deploys, captures_on }, task_id) => {
      return calculatePoints([...captures, ...deploys, ...captures_on]) >= (task_id - 38) ? 1 : 0;
    },
  },
};
