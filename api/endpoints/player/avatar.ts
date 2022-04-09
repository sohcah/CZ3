import { FastifyInstance } from "fastify";

export default function PlayerAvatar(fastify: FastifyInstance) {
  fastify.get("/player/:user/avatar", async (request, reply) => {
    try {
      const user_id = await request.getUserID();
      reply.redirect(
        `https://munzee.global.ssl.fastly.net/images/avatars/ua${user_id.toString(36)}.png`
      );
    } catch {
      reply.redirect("https://munzee.global.ssl.fastly.net/images/noava.png");
    }
  });
}
