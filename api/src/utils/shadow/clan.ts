import { prisma } from "../prisma";
import { getShadowPlayerStats } from "./player";

export interface getShadowClanStatsOptions {
  clanId: number;
  gameId: number;
}

export async function getShadowClanStats(options: getShadowClanStatsOptions) {
  const players = await prisma.shadow_player.findMany({
    where: {
      clan_id: options.clanId,
      game_id: options.gameId,
    },
    select: {
      user_id: true,
      player: {
        select: {
          username: true,
        },
      },
    },
  });

  const stats = await Promise.all(
    players.map(async player => {
      try {
        return {
          user_id: player.user_id,
          username: player.player.username,
          stats: await getShadowPlayerStats({
            user_id: player.user_id,
            game_id: options.gameId,
          })
        };
      } catch {
        return {
          user_id: player.user_id,
          username: player.player.username,
          stats: null,
        };
      }
    })
  );
  return stats;
}
