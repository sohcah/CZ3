import { FastifyInstance } from "fastify";
import { APIError } from "../../api";
import { authenticateWithCuppaZeeToken } from "../../utils/auth";
import config from "../../utils/config";

export default function AuthLogin(fastify: FastifyInstance) {
  fastify.get<{
    Querystring: {
      token?: string;
      application?: string;
    };
  }>("/auth/get", async (request, reply) => {
    if (!request.query.token) {
      throw APIError.InvalidRequest();
    }
    const authenticationResult = await authenticateWithCuppaZeeToken(
      request.query.token,
      config.applications[request.query.application ?? "main"],
    );
    return authenticationResult;
  });
}