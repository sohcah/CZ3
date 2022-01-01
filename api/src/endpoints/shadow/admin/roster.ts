import { FastifyInstance } from "fastify";
import { prisma } from "../../../utils/prisma";

export default function ShadowAdminRoster(fastify: FastifyInstance) {
  fastify.get<{
    Params: {
      group: string;
      game_id: string;
    };
  }>("/shadow/admin/:group/:game_id/roster", async (request, reply) => {
    const group = await prisma.shadow_clan_group.findUnique({
      where: {
        group_text_id: request.params.group,
      },
    });
    
    const clans = await prisma.shadow_clan.findMany({
      where: {
        shadow_clan_group: {
          group_text_id: request.params.group,
        }
      }
    });

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
        shadow_player_properties: {
          distinct: "user_id",
        }
      }
    });

    // Check Authentication
    let isAdmin = false;
    try {
      const authenticatedUser = await request.authenticatedUser();
      console.log(authenticatedUser);
      const adminGroup = await prisma.shadow_clan_group.findFirst({
        where: {
          group_text_id: request.params.group,
          shadow_clan_group_admin: {
            some: {
              user_id: authenticatedUser,
            },
          },
        },
      });
      isAdmin = !!adminGroup;
    } catch { }
    if (isAdmin) {
      // Admin
      return {
        clans: clans.map(clan => ({
          clan_id: clan.clan_id,
          name: clan.name,
        })),
        players: players.map(player => ({
          user_id: player.user_id,
          username: player.player.username,
          clan_id: player.clan_id,
          properties: player.shadow_player_properties[0]?.properties ?? null,
        })),
        group,
      }
    }
    return {
      clans: clans.map(clan => ({
        clan_id: clan.clan_id,
        name: clan.name,
      })),
      players: players.map(player => ({
        user_id: player.user_id,
        username: player.player.username,
        clan_id: player.clan_id,
        properties: null,
      })),
      group,
    };
  });
}
