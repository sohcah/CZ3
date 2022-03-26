import { FastifyInstance } from "fastify";
import { authenticateAnonymous } from "../../utils/auth";
import { munzeeFetch } from "../../utils/munzee";

import ExcelJS from "exceljs";
import { APIError } from "../../api";
import { GameID } from "@cuppazee/utils/lib";
import dayjs from "dayjs";

export default function DataExportClanLeaderboard(fastify: FastifyInstance) {
  for (const path of ["/export/clan/:game_id/leaderboard", "/export/clan/:year/:month/leaderboard"])
    fastify.get<{
      Params: { game_id?: string; month?: string; year?: string };
    }>(path, async (request, reply) => {
      let gameID: GameID;
      if (request.params.game_id) {
        gameID = new GameID(Number(request.params.game_id));
      } else {
        gameID = new GameID(Number(request.params.year), Number(request.params.month) - 1);
      }

      const token = await authenticateAnonymous();

      const response = await munzeeFetch({
        endpoint: "clan/v2/leaderboard",
        params: {
          game_id: gameID.game_id,
        },
        token,
      });
      const { data } = await response.getMunzeeData();

      if (!data?.leaderboard) {
        throw APIError.MunzeeInvalid();
      }

      const workbook = new ExcelJS.Workbook();

      const sheet = workbook.addWorksheet(
        `Leaderboard - ${dayjs(gameID.date).format("MM YYYY")}`
      );

      sheet.columns = [
        { header: "Rank", key: "rank", width: 10 },
        { header: "Clan", key: "name", width: 30 },
        { header: "Level", key: "level_reached", width: 10 },
        { header: "Total", key: "lb_total", width: 10 },
      ];

      for (const clan of data.leaderboard) {
        sheet.addRow({
          rank: clan.rank,
          name: clan.name,
          level_reached: clan.level_reached,
          lb_total: clan.lb_total,
        });
      }

      reply
        .type("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        .send(await workbook.xlsx.writeBuffer());
    });
}
