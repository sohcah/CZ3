import { FastifyInstance } from "fastify";
import { loginWithAuthorizationCode } from "../../utils/auth";
import config from "../../utils/config";

export default function AuthLogin(fastify: FastifyInstance) {
  fastify.get<{
    Querystring: {
      code?: string;
      state?: string;
    };
  }>("/auth/login", async (request, reply) => {
    if (!request.query.code || !request.query.state) {
      return reply.redirect("https://cuppazee.app");
    }
    const state = JSON.parse(request.query.state);
    const token = await loginWithAuthorizationCode(
      config.applications[state.application ?? "main"],
      request.query.code,
      state
    );
    return reply.redirect(`${state.redirect}?code=${encodeURIComponent(token)}`);
  });
}