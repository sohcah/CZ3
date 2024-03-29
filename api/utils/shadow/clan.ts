import { p } from "../prisma.js";
import { getShadowPlayerStats } from "./player.js";

export interface getShadowClanStatsOptions {
  clanId: number;
  gameId: number;
}

export async function getShadowClanStats(options: getShadowClanStatsOptions) {
  const players = await p.shadow_player.findMany({
    where: {
      clan_id: options.clanId,
      game_id: options.gameId,
    },
    select: {
      user_id: true,
      game_id: true,
      clan_id: true,
      group_id: true,
      player: {
        select: {
          username: true,
        },
      },
      shadow_player_task: {
        include: {
          shadow_player_task_day: true,
        },
      },
    },
  });

  const stats = await Promise.all(
    players.map(async player => {
      try {
        const playerStats = await getShadowPlayerStats({
          user_id: player.user_id,
          game_id: options.gameId,
          shadowPlayer: player,
        });
        return {
          user_id: player.user_id,
          username: player.player.username,
          stats: playerStats,
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
