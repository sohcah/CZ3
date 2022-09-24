import { getBouncers } from "../utils/bouncers.js";
import { t } from "../trpc.js";

export const bouncerRouter = t.router({
  list: t.procedure.query(async () => {
    const bouncers = await getBouncers();
    return {
      bouncers,
    };
  }),
});
