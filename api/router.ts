import { flagsRouter } from "./routers/flags/router.js";
import { createRouter } from "./routers/index.js";
import { playerRouter } from "./routers/player.js";
import { typeRouter } from "./routers/type.js";
import { discordRouter } from "./routers/discord.js";
import { bouncerRouter } from "./routers/bouncer.js";
import { tourismRouter } from "./routers/tourism.js";
import { munzeeRouter } from "./routers/munzee.js";

export const appRouter = createRouter()
  .merge("flags:", flagsRouter)
  .merge("player:", playerRouter)
  .merge("type:", typeRouter)
  .merge("discord:", discordRouter)
  .merge("bouncer:", bouncerRouter)
  .merge("tourism:", tourismRouter)
  .merge("munzee:", munzeeRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
