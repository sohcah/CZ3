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
        }
      }
    },
  });

  // const stats = [];
  // for (const player of players) {
  //   try {
  //     stats.push({
  //       user_id: player.user_id,
  //       username: player.player.username,
  //       stats: await getShadowPlayerStats({
  //         user_id: player.user_id,
  //         game_id: options.gameId,
  //         shadowPlayer: player,
  //       }),
  //     });
  //   } catch {
  //     stats.push({
  //       user_id: player.user_id,
  //       username: player.player.username,
  //       stats: null,
  //     });
  //   }
  // }
  
  const stats = await Promise.all(
    players.map(async player => {
      try {
        return {
          user_id: player.user_id,
          username: player.player.username,
          stats: await getShadowPlayerStats({
            user_id: player.user_id,
            game_id: options.gameId,
          }),
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
