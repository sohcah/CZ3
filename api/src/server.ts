import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import FastifyCors from "fastify-cors";
import { APIError, APIResponse, CuppaZeeProperties } from "./api";
import endpoints from "./endpoints/_index";
import { authenticatedUser, authenticateHeaders, AuthenticateHeadersOptions, AuthHeaders } from "./utils/auth";
const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === "development" ? "debug" : "warn",
  },
});
fastify.register(FastifyCors, {
  origin: true,
});

import "./utils/munzee";
import { munzeeFetch } from "./utils/munzee";

declare module "fastify" {
  interface FastifyRequest {
    _cuppazeeIsDeprecated: boolean;
    cuppazeeProperties: CuppaZeeProperties;
    authenticateHeaders(
      options?: AuthenticateHeadersOptions
    ): ReturnType<typeof authenticateHeaders>;
    authenticatedUser(): Promise<number>;
    getUsername(): Promise<string>;
    getUserID(): Promise<number>;
    deprecated(): void;
  }
  interface FastifyReply {
    success<T>(data: T): void;
    error(error: APIError): void;
  }
}

fastify.decorateRequest("cuppazeeProperties", undefined);
fastify.decorateRequest("_cuppazeeIsDeprecated", false);

fastify.decorateRequest(
  "authenticateHeaders",
  function (this: FastifyRequest, options?: AuthenticateHeadersOptions) {
    const headers = this.headers as AuthHeaders;
    return authenticateHeaders(headers, options);
  }
);

fastify.decorateRequest(
  "authenticatedUser",
  async function (this: FastifyRequest) {
    const token = await this.authenticateHeaders();
    return await authenticatedUser(token);
  }
)

fastify.decorateRequest(
  "deprecated",
  function (this: FastifyRequest) {
    this._cuppazeeIsDeprecated = true;
  }
);

const userIDCache = new Map<string, number>();
const usernameCache = new Map<number, string>();

fastify.decorateRequest("getUsername", async function (this: FastifyRequest): Promise<string> {
  const { user } = this.params as { user: string };
  if (!user) throw APIError.InvalidRequest("No user found");
  if (user.startsWith("@")) {
    if(usernameCache.has(Number(user.slice(1)))) return usernameCache.get(Number(user.slice(1)))!;
    const token = await this.authenticateHeaders({ anonymous: true });
    const data = await munzeeFetch({
      endpoint: "user",
      params: { user_id: Number(user.slice(1)) },
      token,
    });
    const username = (await data.getMunzeeData()).data?.username;
    if (!username) throw APIError.InvalidRequest("No user found");
    usernameCache.set(Number(user.slice(1)), username);
    return username;
  }
  return user;
});

fastify.decorateRequest("getUserID", async function (this: FastifyRequest): Promise<number> {
  const { user } = this.params as { user: string };
  if (!user) throw APIError.InvalidRequest("No user found");
  if (!user.startsWith("@")) {
    if (userIDCache.has(user)) return userIDCache.get(user)!;
    const token = await this.authenticateHeaders({ anonymous: true });
    const data = await munzeeFetch({
      endpoint: "user",
      params: { username: user },
      token,
    });
    const user_id = (await data.getMunzeeData()).data?.user_id;
    if (!user_id) throw APIError.InvalidRequest("No user found");
    userIDCache.set(user, user_id);
    return user_id;
  }
  const user_id = Number(user.slice(1));
  if (Number.isNaN(user_id)) {
    throw APIError.InvalidRequest();
  }
  return user_id;
});

fastify.addHook("onRequest", async request => {
  request.cuppazeeProperties = { startTime: process.hrtime() };
});

fastify.decorateReply("success", function <T>(this: FastifyReply, data: T) {
  const response = APIResponse.Success(data, this.request);
  this.status(response.statusCode).send(response);
});

fastify.decorateReply("successRaw", function <T>(this: FastifyReply, data: T) {
  this.send({ __raw: data });
});

fastify.decorateReply("error", function <T>(this: FastifyReply, error: APIError) {
  const response = APIResponse.Error(error, this.request);
  this.status(response.statusCode).send(response);
});

fastify.addHook("preSerialization", async (request, reply, payload: any) => {
  if (payload?.__raw) {
    return payload.__raw;
  }
  if (payload && payload instanceof APIResponse) {
    return payload;
  }
  const response = APIResponse.Success(payload, request);
  reply.status(response.statusCode);
  return response;
});

fastify.setErrorHandler(async function (error, request, reply) {
  console.log(error);
  // Log error
  this.log.error(error);

  if (error instanceof Promise) {
    try {
      error = await error;
    } catch {}
  }

  if (error instanceof APIError) {
    // Send error response
    reply.error(error);
    return;
  }
  // Send error response
  reply.error(APIError.Unexpected(error));
});

fastify.setNotFoundHandler(function (request, reply) {
  // Send error response
  reply.error(APIError.NotFound());
});

endpoints.forEach(f => f(fastify));

const start = async () => {
  try {
    await fastify.listen(80, "0.0.0.0");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
