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
    const response = await munzeeFetch({
      endpoint: "statzee/player/day",
      params: JSON.parse(request.body.data),
      token: request.body.access_token,
    });
    const result = (await response.json()) as Awaited<ReturnType<typeof response.getMunzeeData>>;

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
    return { __raw: result };
  });
}
