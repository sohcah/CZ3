import { FastifyInstance } from "fastify";
import { authenticateAnonymous } from "../../utils/auth/index.js";
import { meta } from "../../utils/meta.js";
import { munzeeFetch } from "../../utils/munzee.js";

export default function PlayerCaptures(fastify: FastifyInstance) {
  fastify.get<{
    Params: { user: string };
  }>("/player/:user/captures/types", async request => {
    const user_id = await request.getUserID();
    const response = await munzeeFetch({
      endpoint: "user/specials",
      params: { user_id },
      token: await authenticateAnonymous(),
    });
    return Object.fromEntries(
      ((await response.getMunzeeData()).data ?? []).map(
        i => [meta.getIconId(i.logo), i.count] as const
      )
    );
  });
}
