/** @type {import('next').NextConfig} */
const withPlugins = require("next-compose-plugins");
const { withTamagui } = require("@tamagui/next-plugin");
// const { withExpo } = require('@expo/next-adapter')
const withTM = require("next-transpile-modules");
const path = require("path");
const withFonts = require("next-fonts");

process.env.IGNORE_TS_CONFIG_PATHS = "true";
process.env.TAMAGUI_TARGET = "web";

const disableExtraction = process.env.NODE_ENV === "development";
if (disableExtraction) {
  console.log("Disabling static extraction in development mode for better HMR");
}

const transform = withPlugins([
  withFonts(),
  withTM([
    "solito",
    "react-native-web",
    "@expo/next-adapter",
    "expo-linking",
    "expo-constants",
    "expo-modules-core",
    "@cz3/app",
    "@cz3/app_ui",
    "react-native-reanimated",
    "@expo/vector-icons",
  ]),
  withTamagui({
    config: "./tamagui.config.ts",
    components: ["@tamagui/core", "@tamagui/drawer", "tamagui"],
    importsWhitelist: ["constants.js", "colors.js"],
    logTimings: true,
    disableExtraction,
    shouldExtract: path => {
      if (path.includes("app")) {
        return true;
      }
    },
    excludeReactNativeWebExports: [
      "Switch",
      "ProgressBar",
      "Picker",
      "Animated",
      "AnimatedFlatList",
      "VirtualizedList",
      "VirtualizedSectionList",
      "FlatList",
      "CheckBox",
    ],
  }),
]);

module.exports = function (name, { defaultConfig }) {
  defaultConfig.webpack5 = true;
  // defaultConfig.experimental.reactRoot = 'concurrent'
  defaultConfig.typescript.ignoreBuildErrors = true;
  // defaultConfig.pageExtensions = ["web.tsx", "web.ts", "tsx", "ts", "jsx", "js"]
  return transform(name, {
    ...defaultConfig,
    webpack5: true,
    experimental: {
      plugins: true,
      scrollRestoration: true,
      legacyBrowsers: false,
      browsersListForSwc: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  });
};
