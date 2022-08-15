import { config } from "@cz3/app_config";

export type Conf = typeof config;

declare module "@cz3/app_ui" {
  // noinspection JSUnusedGlobalSymbols
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface TamaguiCustomConfig extends Conf {}
}

export default config;
