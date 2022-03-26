import { FastifyInstance } from "fastify";
import { getShadowClanStats } from "../../utils/shadow/clan";

export default function ShadowClanStats(fastify: FastifyInstance) {
  fastify.get<{
    Params: {
      clan_id: string;
      game_id: string;
    };
  }>("/shadow/clan/:game_id/:clan_id/stats", async (request, reply) => {
    const players = await getShadowClanStats({
        clanId: Number(request.params.clan_id),
        gameId: Number(request.params.game_id),
    });
    return { players };
  });
}
