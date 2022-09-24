import { flagsRouter } from "./routers/flags/router.js";
import { playerRouter } from "./routers/player.js";
import { typeRouter } from "./routers/type.js";
import { discordRouter } from "./routers/discord.js";
import { bouncerRouter } from "./routers/bouncer.js";
import { tourismRouter } from "./routers/tourism.js";
import { munzeeRouter } from "./routers/munzee.js";
import { t } from "./trpc.js";

export const appRouter = t.router({
  flags: flagsRouter,
  player: playerRouter,
  type: typeRouter,
  discord: discordRouter,
  bouncer: bouncerRouter,
  tourism: tourismRouter,
  munzee: munzeeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
