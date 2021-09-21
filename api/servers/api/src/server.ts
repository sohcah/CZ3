import Fastify, { FastifyReply } from "fastify";
import FastifyCors from "fastify-cors";
import { APIError, APIResponse, CuppaZeeProperties } from "./api";
import endpoints from "./endpoints/_index";
const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === "development" ? "debug" : "warn",
  }
});
fastify.register(FastifyCors, {
  origin: true,
});

import "./utils/munzee";

declare module "fastify" {
  interface FastifyRequest {
    cuppazeeProperties: CuppaZeeProperties;
  }
  interface FastifyReply {
    success<T>(data: T): void;
    error(error: APIError): void;
  }
}

fastify.decorateRequest("cuppazeeProperties", undefined)

fastify.addHook("onRequest", async (request) => {
  request.cuppazeeProperties = { startTime: process.hrtime() };
});

fastify.decorateReply("success", function <T>(this: FastifyReply, data: T) {
  const response = APIResponse.Success(data, this.request);
  this.status(response.statusCode).send(response);
});

fastify.decorateReply("successRaw", function <T>(this: FastifyReply, data: T) {
  this.send({__raw: data});
});

fastify.decorateReply("error", function <T>(this: FastifyReply, error: APIError) {
  const response = APIResponse.Error(error, this.request);
  this.status(response.statusCode).send(response);
});

fastify.addHook("preSerialization", async (request, reply, payload: any) => {
  console.log(payload);
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
    } catch { }
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
