import { FastifyInstance } from "fastify";

export default function clan_v2_requirements(fastify: FastifyInstance) {
  fastify.get("/patches", async request => {
    return { patchedMunzeeAPIEndpoints: ["clan/v2/requirements"] };
  });
}
