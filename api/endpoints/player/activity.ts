import { FastifyInstance } from "fastify";
import { authenticateWithUserID } from "../../utils/auth/index.js";
import { getPlayerActivity, getPlayerActivityOverview } from "../../utils/data/activity.js";
import { munzeeFetch } from "../../utils/munzee.js";
import { getLegacyPlayerActivity } from "../../utils/legacy_data/activity.js";

export default function PlayerActivity(fastify: FastifyInstance) {
  fastify.get<{
    Params: { day: string };
  }>("/player/:user/activity/:day", async request => {
    const user_id = await request.getUserID();
    const username = await request.getUsername();
    const authenticationResult = await authenticateWithUserID(user_id);
    const response = await munzeeFetch({
      endpoint: "statzee/player/day",
      params: {
        day: request.params.day,
      },
      token: authenticationResult.access_token,
    });
    const activity = getPlayerActivity(username, (await response.getMunzeeData()).data);
    return {
      activity,
      ...getPlayerActivityOverview(activity),
    };
  });
  fastify.get<{
    Params: { day: string; filters: string };
  }>("/legacy/player/:user/activity/:day/:filters", async request => {
    const user_id = await request.getUserID();
    const username = await request.getUsername();
    const authenticationResult = await authenticateWithUserID(user_id);
    const response = await munzeeFetch({
      endpoint: "statzee/player/day",
      params: {
        day: request.params.day,
      },
      token: authenticationResult.access_token,
    });
    const activity = getPlayerActivity(username, (await response.getMunzeeData()).data);
    return {
      legacyActivity: getLegacyPlayerActivity(activity, JSON.parse(request.params.filters)),
    };
  });
}
