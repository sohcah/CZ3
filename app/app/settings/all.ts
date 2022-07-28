import { SettingsSection, SettingsSectionWithAtoms } from "@cz3/app/settings/common";
import { captureGridSettings } from "@cz3/app/settings/captureGrids";

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
];
