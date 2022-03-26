import { FastifyInstance } from "fastify";
import { knownMissing } from "../../utils/knownMissing";

export default function MiscKnownMissing(fastify: FastifyInstance) {
  fastify.get("/misc/knownmissing", async (request, reply) => {
    return await knownMissing.toJSON();
  });
}