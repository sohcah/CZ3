import { FastifyInstance } from "fastify";
import { prisma } from "../../../utils/prisma";

export default function ShadowAdminList(fastify: FastifyInstance) {
  fastify.get<{
    Params: {
      group: string;
      game_id: string;
    };
  }>("/shadow/admin/:group/:game_id/list", async (request, reply) => {
    const players = await prisma.shadow_player.findMany({
      where: {
        OR: [
          {
            game_id: Number(request.params.game_id),
            shadow_clan_group: {
              group_text_id: request.params.group,
            },
          },
          {
            game_id: Number(request.params.game_id),
            shadow_clan: {
              shadow_clan_group: {
                group_text_id: request.params.group,
              }
            },
          },
        ],
      },
      include: {
        player: {
          select: {
            username: true,
          },
        },
        shadow_player_properties: true,
      }
    });
    return { players };
  });
}
