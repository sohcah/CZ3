import config from "../utils/config";
import Rollbar from "rollbar";

export const rollbar = config.rollbar ? new Rollbar(config.rollbar) : null;