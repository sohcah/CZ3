import { FastifyInstance } from "fastify";
import { munzeeFetch } from "../../utils/munzee";
import { knownMissing } from "../../utils/knownMissing";

export default function statzee_player_day(fastify: FastifyInstance) {
  fastify.post<{
    Body: {
      data: string;
      access_token: string;
    };
  }>("/patches/statzee/player/day", async request => {
    const dataParams = JSON.parse(request.body.data);
    const response = await munzeeFetch({
      endpoint: "statzee/player/day",
      params: dataParams,
      token: request.body.access_token,
    });
    const result = await response.getMunzeeData();

    for (const item of [
      ...(result.data?.captures ?? []),
      ...(result.data?.deploys ?? []),
      // Capture Type IDs for Capons are Inaccurate
      // ...(result.data?.captures_on ?? []),
    ]) {
      if (knownMissing.missingType(item.pin, item.capture_type_id)) {
        knownMissing.ensureType(item.pin, item.capture_type_id, {
          from: "statzee/player/day",
          item,
          body: request.body.data,
          authenticated_entity: result.authenticated_entity,
        });
      }
    }
    if (!dataParams.__dont_merge_passive) {
      // @ts-expect-error
      if (result.data?.captures && result.data?.passive_captures) {
        // @ts-expect-error
        result.data.captures.push(...result.data.passive_captures);
        // @ts-expect-error
        delete result.data.passive_captures;
      }
      // @ts-expect-error
      if (result.data?.deploys && result.data?.passive_deploys) {
        // @ts-expect-error
        result.data.deploys.push(...result.data.passive_deploys);
        // @ts-expect-error
        delete result.data.passive_deploys;
      }
    }
    return { __raw: result };
  });
}
