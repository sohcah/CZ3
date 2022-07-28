import { createRouter } from "./index.js";
import { getBouncers } from "../utils/bouncers.js";

export const bouncerRouter = createRouter()
  .query("list", {
    async resolve() {
      const bouncers = await getBouncers();
      return {
        bouncers
      };
    },
  });
