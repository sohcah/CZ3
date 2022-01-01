import { FastifyInstance } from "fastify";
import { getShadowPlayerStats } from "../../utils/shadow/player";

export default function PlayerClanProgress(fastify: FastifyInstance) {
  fastify.get < {
    Params: { game_id: string }
  }>("/player/:user/clanprogress/:game_id", async (request, reply) => {
    const user_id = await request.getUserID();
    const shadowPlayerStats = await getShadowPlayerStats({
      user_id,
      game_id: Number(request.params.game_id),
    })
    return { stas: shadowPlayerStats };
  });
}