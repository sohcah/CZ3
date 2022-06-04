import { shorthands } from "@tamagui/shorthands";
import { color, radius, size, space, themes, zIndex } from "@tamagui/theme-base";
import { createTamagui, createTokens } from "@cz3/app_ui";
import { createInterFont } from "@tamagui/font-inter";

import { animations } from "./constants/animations";

const headingFont = createInterFont({
  size: {
    6: 15,
  },
  transform: {
    6: "uppercase",
    7: "none",
  },
  weight: {
    6: "400",
    7: "700",
  },
  color: {
    6: "$colorFocus",
    7: "$color",
  },
  letterSpacing: {
    5: 2,
    6: 1,
    7: 0,
    8: -1,
    9: -2,
    10: -3,
    12: -4,
    14: -5,
    15: -6,
  },
});

const bodyFont = createInterFont(
  {},
  {
    sizeSize: size => Math.round(size * 1.1),
    sizeLineHeight: size => Math.round(size * 1.1 + (size > 20 ? 10 : 10)),
  }
);

const config = createTamagui({
  animations,
  defaultTheme: "light",
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  shorthands,
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
  themes: {
    ...themes,
    // @ts-expect-error Incorrect typings for themes
    dark_green: themes.dark_gray,
    dark_green_alt1: themes.dark_gray_alt1,
    dark_green_alt2: themes.dark_gray_alt2,
    dark_green_alt3: themes.dark_gray_alt3,
    dark_green_alt4: themes.dark_gray_alt4,
    // dark_green_alt1_Button: themes.dark_gray_alt1_Button,
    // dark_green_alt2_Button: themes.dark_gray_alt2_Button,
    // dark_green_alt3_Button: themes.dark_gray_alt3_Button,
    // dark_green_alt4_Button: themes.dark_gray_alt4_Button,
    // dark_green_Button: themes.dark_gray_Button,
    // @ts-expect-error Incorrect typings for themes
    dark_green_DrawerFrame: themes.dark_gray_DrawerFrame,
    // dark_green_SliderTrack: themes.dark_gray_SliderTrack,
    // dark_green_SliderTrackActive: themes.dark_gray_SliderTrackActive,
    // dark_green_SliderThumb: themes.dark_gray_SliderThumb,
    // @ts-expect-error Incorrect typings for themes
    dark_green_Progress: themes.dark_gray_Progress,
    // @ts-expect-error Incorrect typings for themes
    dark_green_ProgressIndicator: themes.dark_gray_ProgressIndicator,
    // @ts-expect-error Incorrect typings for themes
    dark_green_Switch: themes.dark_gray_Switch,
    // @ts-expect-error Incorrect typings for themes
    dark_green_SwitchThumb: themes.dark_gray_SwitchThumb,
    // dark_green_TooltipArrow: themes.dark_gray_TooltipArrow,
    // dark_green_TooltipContent: themes.dark_gray_TooltipContent,
    // @ts-expect-error Incorrect typings for themes
    dark_green_darker: themes.dark_gray_darker,
    // @ts-expect-error Incorrect typings for themes
    dark_green_active: themes.dark_gray_active,
  },
  tokens: createTokens({
    size,
    space,
    zIndex,
    color,
    radius,
  }),
  media: {
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: "none" },
    pointerCoarse: { pointer: "coarse" },
  },
});

export type Conf = typeof config;

declare module "@cz3/app_ui" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface TamaguiCustomConfig extends Conf {}
}

export default config;
