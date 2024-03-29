import { FastifyInstance } from "fastify";
import { p } from "../../../utils/prisma.js";

export default function ShadowAdminRoster(fastify: FastifyInstance) {
  fastify.get<{
    Params: {
      group: string;
      game_id: string;
    };
  }>("/shadow/admin/:group/:game_id/roster", async request => {
    const group = await p.shadow_clan_group.findUnique({
      where: {
        group_text_id: request.params.group,
      },
    });

    const clans = await p.shadow_clan.findMany({
      where: {
        game_id: Number(request.params.game_id),
        shadow_clan_group: {
          group_text_id: request.params.group,
        },
      },
    });

    const players = await p.shadow_player.findMany({
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
              },
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
        },
      },
    });

    // Check Authentication
    let isAdmin = false;
    try {
      const authenticatedUser = await request.authenticatedUser();
      console.info(authenticatedUser);
      const adminGroup = await p.shadow_clan_group.findFirst({
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
      // eslint-disable-next-line no-empty
    } catch {}
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
      };
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
