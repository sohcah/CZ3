import { FastifyInstance } from "fastify";
import { APIError } from "../../api.js";
import { authenticateWithCuppaZeeToken } from "../../utils/auth/index.js";
import { config } from "../../utils/config.js";

export default function AuthLogin(fastify: FastifyInstance) {
  fastify.get<{
    Querystring: {
      token?: string;
      application?: string;
    };
  }>("/auth/get", async request => {
    if (!request.query.token) {
      throw APIError.InvalidRequest();
    }
    const authenticationResult = await authenticateWithCuppaZeeToken(
      request.query.token,
      config.applications[request.query.application ?? "main"]
    );
    return authenticationResult;
  });
}
