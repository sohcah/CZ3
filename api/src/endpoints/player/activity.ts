import { FastifyInstance } from "fastify";
import { authenticateWithUserID } from "../../utils/auth";
import { GenerateUserActivity } from "../../utils/data/activity";
import { munzeeFetch } from "../../utils/munzee";

export default function PlayerActivity(fastify: FastifyInstance) {
  fastify.get < {
    Params: { day: string }
  }>("/player/:user/activity/:day", async (request, reply) => {
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
    const data = GenerateUserActivity(username, (await response.getMunzeeData()).data);
    return data;
  });
}