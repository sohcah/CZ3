import { FastifyInstance } from "fastify";

export default function clan_v2_requirements(fastify: FastifyInstance) {
  fastify.post("/patches", async request => {
    return ["clan/v2/requirements"];
  });
}
