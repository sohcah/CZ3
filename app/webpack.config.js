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

  const DefinePlugin = config.plugins.find(x => x.constructor.name === "DefinePlugin");
  DefinePlugin.definitions["process.env"]["TAMAGUI_TARGET"] = `"web"`;

  return config;
};
