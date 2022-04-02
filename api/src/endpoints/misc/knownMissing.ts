import { FastifyInstance } from "fastify";
import { knownMissing } from "../../utils/knownMissing.js";

export default function MiscKnownMissing(fastify: FastifyInstance) {
  fastify.get("/misc/knownmissing", async () => {
    return await knownMissing.toJSON();
  });
}
