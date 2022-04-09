import { FastifyInstance } from "fastify";
import { authenticateAnonymous } from "../../utils/auth/index.js";
import { munzeeFetch } from "../../utils/munzee.js";
// TODO: Move to utils package
export class GameID {
  private _gameID: number;
  private _dayjs: Dayjs;

  constructor(game_id: number);
  constructor(date: Dayjs);
  constructor(year: number, month: number);
  constructor();
  constructor(a?: number | Dayjs, b?: number) {
    if (typeof a === "number" && typeof b === "undefined") {
      this._gameID = a;
    } else if (typeof a === "number" && typeof b === "number") {
      this._gameID = a * 12 + b - 24158;
    } else if (typeof a === "object") {
      this._gameID = a.get("year") * 12 + a.get("month") - 24158;
    } else if (!a && !b) {
      this._gameID = dayjs.mhqNow().get("year") * 12 + dayjs.mhqNow().get("month") - 24158;
    } else {
      throw "Invalid input";
    }
    this._dayjs = dayjs(
      new Date(Math.floor((this._gameID + 24158) / 12), (this._gameID + 24158) % 12)
    );
  }

  get month() {
    return this._dayjs.month();
  }

  get year() {
    return this._dayjs.year();
  }

  get game_id() {
    return this._gameID;
  }

  get date() {
    return this._dayjs.toDate();
  }
}

import ExcelJS from "exceljs";
import { APIError } from "../../api.js";
import { default as dayjs, Dayjs } from "dayjs";

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

      const sheet = workbook.addWorksheet(`Leaderboard - ${dayjs(gameID.date).format("MM YYYY")}`);

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
