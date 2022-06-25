import { test, expect } from "vitest";
import { StatzeePlayerDay } from "@cz3/api-types/statzee/player/day.js";
import { ActivityData, addActivityItemExtras, taskCalculations } from "./tasks.js";

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

type ActData = DeepPartial<NonNullable<StatzeePlayerDay["response"]["data"]>>;

function patchPin<T extends { pin: string }>(items: T[]) {
  return items.map(item => {
    if (!item.pin.startsWith("https://")) {
      item.pin = `https://munzee.global.ssl.fastly.net/images/pins/${item.pin}.png`;
    }
    return item;
  });
}

function calculate(data: ActData, task_id: number) {
  const d = data as NonNullable<StatzeePlayerDay["response"]["data"]>;
  const activity = {
    captures: addActivityItemExtras(patchPin(d.captures ?? [])),
    deploys: addActivityItemExtras(patchPin(d.deploys ?? [])),
    captures_on: addActivityItemExtras(patchPin(d.captures_on ?? [])),
  } as ActivityData;
  const taskCalculator = taskCalculations[task_id % 1000];
  return taskCalculator.calculate(activity, task_id);
}

test("Mystery Points Count correctly", () => {
  const data: ActData = {
    captures: [
      {
        points: "145",
        pin: "mystery",
      },
      {
        points: "100",
        pin: "charge",
      },
    ],
  };
  expect(calculate(data, 34)).toBe(145);
});
