process.env.TAMAGUI_TARGET ??= "native";

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", { jsxRuntime: "automatic" }]],
    plugins: [
      "@babel/plugin-proposal-logical-assignment-operators",
      "@babel/plugin-proposal-nullish-coalescing-operator",
      "@babel/plugin-proposal-optional-chaining",
      ...(process.env.TAMAGUI_TARGET === "web"
        ? []
        : [
            [
              "@tamagui/babel-plugin",
              {
                components: ["tamagui"],
                config: "./src/tamagui.config.ts",
                logTimings: true,
                disableExtraction: process.env.NODE_ENV === "development",
              },
            ],
          ]),
      [
        "transform-inline-environment-variables",
        {
          include: "TAMAGUI_TARGET",
        },
      ],
      [
        "module-resolver",
        {
          root: ["./"],
          extensions: [".ts", ".tsx", ".js", ".ios.js", ".android.js"],
          alias: {
            "@": "./src",
            "@trpc/client": "@trpc/client/dist/index.js",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
