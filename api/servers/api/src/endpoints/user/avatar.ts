import { FastifyInstance } from "fastify";
import { authenticateAnonymous } from "../../utils/auth";
import { munzeeFetch } from "../../utils/munzee";

export default function UserAvatar(fastify: FastifyInstance) {
  fastify.get<{
    Params: {
      username?: string;
    };
  }>("/user/avatar/:username", async (request, reply) => {
    if (!request.params.username) {
      reply.redirect("https://munzee.global.ssl.fastly.net/images/noava.png");
      return;
    }
    try {
      const token = await authenticateAnonymous();
      const userResponse = await munzeeFetch({
        endpoint: "user",
        params: { username: request.params.username },
        token,
      });
      const user = await userResponse.getMunzeeData();
      if (!user?.data?.user_id) {
        reply.redirect("https://munzee.global.ssl.fastly.net/images/noava.png");
        return;
      }
      reply.redirect(
        `https://munzee.global.ssl.fastly.net/images/avatars/ua${Number(user.data.user_id).toString(
          36
        )}.png`
      );
    } catch {
      reply.redirect("https://munzee.global.ssl.fastly.net/images/noava.png");
    }
  });
}
