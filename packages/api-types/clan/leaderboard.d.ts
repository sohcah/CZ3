import { EndpointBase, Response } from "../common";

export interface ClanV2Leaderboard extends EndpointBase {
  path: "clan/v2/leaderboard";
  params: {
    game_id: number;
  };
  response: Response<{
    battle: {
      game_id: number;
      start: number;
      end: number;
      reveal_at: number;
      lb_total_task_id: number;
      lb_total_key: string;
      total_clans: number;
    };
    leaderboard: {
      level_reached: number;
      clan_id: number;
      lb_total: number;
      name: string;
      simple_name: string;
      rank: number;
      logo: string;
    }[];
  }>;
}
