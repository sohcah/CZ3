import { FastifyInstance } from "fastify";
import { APIError } from "../../api";
import { authenticateAnonymous } from "../../utils/auth";
import { MunzeeSpecialBouncer } from "@cuppazee/api/munzee/specials";
import { getBouncers } from "../../utils/bouncers";
import { munzeeFetch } from "../../utils/munzee";
import { createRevGeocoder, LookupResult } from "@webkitty/geo-rev";
import geoTz from "geo-tz";

const geocoder = createRevGeocoder();

export default function UserBouncers(fastify: FastifyInstance) {
  fastify.get<{
    Querystring: {
      user_id?: string;
      access_token?: string;
    };
  }>("/user/bouncers", async (request, reply) => {
    if (!request.query.user_id) {
      throw APIError.InvalidRequest();
    }
    const user_id = Number(request.query.user_id);
    if (Number.isNaN(user_id)) {
      throw APIError.InvalidRequest();
    }
    const authenticationResult = request.query.access_token ?? (await authenticateAnonymous());

    const deploys = await (
      await munzeeFetch({
        endpoint: "user/deploys",
        params: { user_id, type_id: 505508 },
        token: authenticationResult,
      })
    ).getMunzeeData();
    const bouncers = await getBouncers();

    for (let page = 1; page < 6 && deploys?.data?.has_more; page++) {
      const pageDeploys = await (
        await munzeeFetch({
          endpoint: "user/deploys",
          params: { user_id, type_id: 505508, page },
          token: authenticationResult,
        })
      )?.getMunzeeData();
      if (!pageDeploys.data?.has_more) deploys.data.has_more = 0;
      deploys.data.munzees = deploys.data.munzees.concat(pageDeploys.data?.munzees ?? []);
    }
    const userBouncers = await Promise.all(
      deploys?.data?.munzees
        .slice()
        .reverse()
        .map(async i => {
          let munzee: typeof i & {
            bouncer?: MunzeeSpecialBouncer;
            location?: LookupResult;
            timezone?: string;
          } = i;
          munzee.bouncer = bouncers.find(
            b =>
              "mythological_munzee" in b &&
              b?.mythological_munzee?.munzee_id.toString() === i.munzee_id.toString()
          ) as MunzeeSpecialBouncer;
          if (munzee.bouncer) {
            munzee.location = (await geocoder).lookup({
              latitude: Number(munzee.bouncer.latitude),
              longitude: Number(munzee.bouncer.longitude),
            });
            munzee.timezone = geoTz(
              Number(munzee.bouncer.latitude),
              Number(munzee.bouncer.longitude)
            );
          }
          return munzee;
        }) || []
    );
    return { bouncers: userBouncers };
  });
}
