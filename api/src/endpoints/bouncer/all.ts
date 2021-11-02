import { FastifyInstance } from "fastify";
import { getBouncers } from "../../utils/bouncers";

export default function BouncerExpiring(fastify: FastifyInstance) {
  fastify.get<{
    Querystring: {
      force?: string;
    };
  }>("/bouncer/all", async (request) => {
    const bouncers = await getBouncers(request.query.force === "TRUE");
    return { bouncers }
  });
}