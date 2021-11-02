import { FastifyInstance } from "fastify";
import { APIError } from "../../api";
import { getBouncers } from "../../utils/bouncers";

export default function BouncerExpiring(fastify: FastifyInstance) {
  fastify.get<{
    Querystring: {
      time?: string;
    };
  }>("/bouncer/expiring", async (request) => {
    if (request.query.time && Number.isNaN(Number(request.query.time))) {
      throw APIError.InvalidRequest("Time must be a number");
    }
    const time = request.query.time ? Number(request.query.time) : 600000;
    const bouncers = await getBouncers();
    return bouncers
      .filter(bouncer => bouncer.special_good_until * 1000 < Date.now() + time)
      .map((bouncer, index) => [
        bouncer.friendly_name,
        ("logo" in bouncer ? bouncer.logo : bouncer.mythological_munzee.munzee_logo).slice(49, -4),
        bouncer.special_good_until,
        bouncer.munzee_id,
        index,
        ...("mythological_munzee" in bouncer
          ? [bouncer.mythological_munzee.friendly_name, bouncer.mythological_munzee.creator_username]
          : []),
      ]);
  });
}