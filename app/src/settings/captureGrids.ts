import { createSetting, createSettings, SettingType } from "@/settings/common";

export const captureGridSettings = createSettings("captureGrid", {
  groupBy: createSetting<"type" | "player">({
    type: SettingType.SegmentSelect,
    name: "Group by",
    description: "Choose what captures are grouped by",
    defaultValue: n => (n > 0.5 ? "type" : "player"),
    options: [
      {
        label: "Type",
        value: "type",
      },
      {
        label: "Player",
        value: "player",
      },
    ],
  }),
  layout: createSetting<"grid" | "cards">({
    type: SettingType.SegmentSelect,
    name: "Layout",
    description: "Choose between class Grid or modern Card layout",
    defaultValue: "grid",
    options: [
      {
        label: "Grid",
        value: "grid",
      },
      {
        label: "Cards",
        value: "cards",
      },
    ],
  }),
});
