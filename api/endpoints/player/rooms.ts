import { UserDeploys } from "@cz3/api-types/user/deploys.js";
import dayjs from "dayjs";
import { FastifyInstance } from "fastify";
import { authenticateWithUserID } from "../../utils/auth/index.js";
import { munzeeFetch } from "../../utils/munzee.js";

export default function PlayerRooms(fastify: FastifyInstance) {
  fastify.get<{
    Params: { day: string };
  }>("/player/:user/rooms", async request => {
    const user_id = await request.getUserID();
    const authenticationResult = await authenticateWithUserID(user_id);

    const rooms: NonNullable<UserDeploys["response"]["data"]>["munzees"] = [];
    for (let page = 0; page < 20; page++) {
      const und = (
        await (
          await munzeeFetch({
            endpoint: "user/deploys",
            params: { user_id, page, type_id: 971 },
            token: authenticationResult,
          })
        ).getMunzeeData()
      ).data;
      if (!und?.has_more) {
        page = 100;
      }
      rooms.push(...(und?.munzees ?? []));
    }
    for (let page = 0; page < 20; page++) {
      const und = (
        await (
          await munzeeFetch({
            endpoint: "user/deploys",
            params: { user_id, page, type_id: 2184 },
            token: authenticationResult,
          })
        ).getMunzeeData()
      ).data;
      if (!und?.has_more) {
        page = 100;
      }
      rooms.push(...(und?.munzees ?? []));
    }

    return {
      rooms: rooms.map(i => {
        const deployed_at = dayjs(i.deployed_at).mhq();
        return {
          ...i,
          expires_at: dayjs
            .mhqParse({
              year: deployed_at.year(),
              month: deployed_at.month(),
              date: deployed_at.date() + 30,
              hour: deployed_at.hour(),
              minute: deployed_at.minute(),
              second: deployed_at.second(),
              millisecond: deployed_at.millisecond(),
            })
            .format(),
        };
      }),
    };
  });
}
