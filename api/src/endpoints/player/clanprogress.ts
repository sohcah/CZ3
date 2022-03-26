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
    return {
      stats: shadowPlayerStats,
      disclaimer: `This data is provided by CuppaZee, and although normally accurate, doesn't always perfectly reflect the progress you will have when you join a clan. If you find issues with this data, you should report the issue to CuppaZee, not Munzee.`,
    };
  });
}