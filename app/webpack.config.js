const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: [
          "tamagui",
          "@tamagui/core",
          "@tamagui/avatar",
          "@trpc/react",
          "@trpc/client",
          "@trpc/server",
        ],
      },
    },
    argv
  );

  const babelRule = config.module.rules[1].oneOf.find(i => i.use.loader?.includes("babel-loader"));
  babelRule.use = [
    {loader: require.resolve('@open-wc/webpack-import-meta-loader')},
    babelRule.use,
  ];

  const DefinePlugin = config.plugins.find(x => x.constructor.name === "DefinePlugin");
  DefinePlugin.definitions["process.env"]["TAMAGUI_TARGET"] = `"web"`;

  return config;
};
