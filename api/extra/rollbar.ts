import { config } from "../utils/config.js";
import Rollbar from "rollbar";

export const rollbar = config.rollbar ? new Rollbar(config.rollbar) : null;

if (rollbar) {
  console.info("[Rollbar] Enabled");
}
