import { FastifyInstance } from "fastify";
import { loginWithAuthorizationCode } from "../../utils/auth";
import config from "../../utils/config";

export default function AuthLogin(fastify: FastifyInstance) {
  fastify.get<{
    Querystring: {
      code?: string;
      state?: string;
      useTeakens?: string;
    };
    Params: {
      application: string;
    }
  }>("/auth/login/:application", async (request, reply) => {
    const applicationConfig = config.applications[request.params.application];
    if (!request.query.code || !request.query.state) {
      return reply.redirect(
        `https://api.munzee.com/oauth?client_id=${encodeURIComponent(
          applicationConfig.client_id
        )}&redirect_uri=${encodeURIComponent(
          applicationConfig.redirect_uri
        )}&response_type=code&scope=read&state=${encodeURIComponent(
          request.query.state ?? JSON.stringify({
            redirect: "https://example.org/",
            platform: "web",
            app: "max",
          })
        )}`
      );
    }
    const state = JSON.parse(request.query.state);
    return await loginWithAuthorizationCode(
      config.applications[request.params.application ?? "main"],
      request.query.code,
      state,
      reply,
      true,
      request.query.useTeakens === "true"
    );
  });
}