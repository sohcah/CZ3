import { FastifyInstance } from "fastify";
import fetch from "node-fetch";

const cache = new Map<string, string>();

export default function Database(fastify: FastifyInstance) {
  fastify.get("/database/resetcache", async () => {
    cache.clear();
    return true;
  });
  fastify.get<{
    Params: {
      file: string;
    };
  }>("/database/:file", async (request, response) => {
    if (!cache.has(request.params.file)) {
      const response = await fetch(
        `https://github.com/CuppaZee/Meta/releases/download/prerelease/${request.params.file}`
      );
      const data = await response.text();
      cache.set(request.params.file, data);
    }
    response.send(cache.get(request.params.file));
  });
}
