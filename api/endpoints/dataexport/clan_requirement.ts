import { FastifyInstance } from "fastify";
import { authenticateAnonymous } from "../../utils/auth/index.js";
import { munzeeFetch } from "../../utils/munzee.js";

import { APIError } from "../../api.js";
import { GameID } from "./clan_leaderboard.js";

export default function DataExportClanRequirements(fastify: FastifyInstance) {
  for (const path of [
    "/export/clan/:game_id/requirements",
    "/export/clan/:year/:month/requirements",
  ])
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
        endpoint: "clan/v2/requirements",
        params: {
          game_id: gameID.game_id,
          clan_id: 1349,
        },
        token,
      });
      const { data } = await response.getMunzeeData();

      if (!data?.data) {
        throw APIError.MunzeeInvalid();
      }

      const groupRequirements = new Set(
        Object.values(data?.data.levels).flatMap(i => i.group.map(i => i.task_id))
      );
      const individualRequirements = new Set(
        Object.values(data?.data.levels).flatMap(i => i.individual.map(i => i.task_id))
      );

      const cols = Math.max(groupRequirements.size, individualRequirements.size) + 1;

      reply.type("text/html").send(`
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
      <table class="table">
        <tr>
          <th colspan="${cols}">Requirements Clanwar May 2022 v1.0</th>
        </tr>
        <tr>
          <th rowspan="3">Level</th>
          <th colspan="${individualRequirements.size}">Player</th>
        </tr>
        <tr>
        <td colspan="3">Captures</td>
        </tr>
        <tr></tr>
        <tr></tr>
        <tr>
          <th rowspan="3">Level</th>
          <th colspan="${groupRequirements.size}">Clan</th>
        </tr>
        <tr>
        <td colspan="3">Captures</td>
        </tr>
        <tr></tr>
        <tr></tr>
      </table>
        `);
    });
}
