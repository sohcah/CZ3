import { UserDeploys } from "@cuppazee/api/user/deploys.js";
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
              // @ts-expect-error Missing type info for objectSupport
              year: deployed_at.year(),
              // @ts-expect-error Missing type info for objectSupport
              month: deployed_at.month(),
              // @ts-expect-error Missing type info for objectSupport
              date: deployed_at.date() + 30,
              // @ts-expect-error Missing type info for objectSupport
              hour: deployed_at.hour(),
              // @ts-expect-error Missing type info for objectSupport
              minute: deployed_at.minute(),
              // @ts-expect-error Missing type info for objectSupport
              second: deployed_at.second(),
              // @ts-expect-error Missing type info for objectSupport
              millisecond: deployed_at.millisecond(),
            })
            .format(),
        };
      }),
    };
  });
}
