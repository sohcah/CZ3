import { SettingsSectionWithAtoms } from "@/settings/common";
import { captureGridSettings } from "@/settings/captureGrids";
import { mapSettings } from "@/settings/map";

export interface Section {
  id: string;
  title: string;
  description?: string;
  icon: string; //keyof typeof MaterialCommunityIcons.glyphMap;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings: SettingsSectionWithAtoms<any, any>;
}

export const settingsSections: Section[] = [
  {
    id: "capturegrids",
    title: "Capture Grids",
    icon: "grid",
    settings: captureGridSettings,
  },
  {
    id: "map",
    title: "Map",
    icon: "map",
    settings: mapSettings,
  },
];
