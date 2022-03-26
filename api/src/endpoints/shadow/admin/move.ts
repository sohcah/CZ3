import { FastifyInstance } from "fastify";
import { APIError } from "../../../api";
import { prisma } from "../../../utils/prisma";

export default function ShadowAdminMove(fastify: FastifyInstance) {
  fastify.post<{
    Params: {
      group: string;
      game_id: string;
    };
    Body: {
      user_id: string;
      clan_id: string;
    };
  }>("/shadow/admin/:group/:game_id/move", async (request, reply) => {
    const authenticatedUser = await request.authenticatedUser();
    const group = await prisma.shadow_clan_group.findFirst({
      where: {
        group_text_id: request.params.group,
        shadow_clan_group_admin: {
          some: {
            user_id: authenticatedUser,
          },
        },
        ...(request.body.clan_id
          ? {
              shadow_clan: {
                some: {
                  clan_id: Number(request.body.clan_id),
                },
              },
            }
          : {}),
      },
    });
    if (!group) {
      throw APIError.Forbidden(
        "You are not an admin of this group, or this clan is not in this group."
      );
    }
    await prisma.shadow_player.update({
      where: {
        user_id_game_id: {
          game_id: Number(request.params.game_id),
          user_id: Number(request.body.user_id),
        },
      },
      data: request.body.clan_id
        ? {
            group_id: group.group_id,
            clan_id: Number(request.body.clan_id),
          }
        : {
            group_id: group.group_id,
          },
    });
    return true;
  });
}
