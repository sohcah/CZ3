import { FastifyInstance } from "fastify";
import { APIError } from "../../api";
import { authenticateWithUserID } from "../../utils/auth";
import { munzeeFetch } from "../../utils/munzee";

export default function UserActivity(fastify: FastifyInstance) {
  fastify.get<{
    Querystring: {
      user_id?: string;
      day?: string;
    };
  }>("/user/activity", async (request, reply) => {
    if (!request.query.user_id) {
      throw APIError.InvalidRequest();
    }
    const user_id = Number(request.query.user_id);
    if (Number.isNaN(user_id)) {
      throw APIError.InvalidRequest();
    }
    const authenticationResult = await authenticateWithUserID(
      user_id
    );
    const data = await munzeeFetch({
      endpoint: "statzee/player/day",
      params: {
        day: request.query.day ?? "2021-09-21"
      },
      token: authenticationResult.access_token,
    });
    return (await data.getMunzeeData()).data;
  });
}