import { createSetting, createSettings, SettingType } from "@/settings/common";

export const mapSettings = createSettings("map", {
  projection: createSetting<
    | "globe"
    | "equalEarth"
    | "naturalEarth"
    | "winkelTripel"
    | "albers"
    | "lambertConformalConic"
    | "equirectangular"
    | "mercator"
  >({
    type: SettingType.SegmentSelect,
    name: "Map Projection",
    description: "Which projection to use for the map",
    defaultValue: "mercator",
    options: [
      {
        label: "Mercator",
        value: "mercator",
      },
      {
        label: "Globe",
        value: "globe",
      },
      {
        label: "Equal Earth",
        value: "equalEarth",
      },
      {
        label: "Natural Earth",
        value: "naturalEarth",
      },
      {
        label: "Winkel Tripel",
        value: "winkelTripel",
      },
      {
        label: "Albers",
        value: "albers",
      },
      {
        label: "Lambert Conformal Conic",
        value: "lambertConformalConic",
      },
      {
        label: "Equirectangular",
        value: "equirectangular",
      },
    ],
  }),
});
