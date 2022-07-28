import { FastifyInstance } from "fastify";
import { getBouncers } from "../../utils/bouncers.js";
import { meta } from "../../utils/meta.js";

export default function BouncerAll(fastify: FastifyInstance) {
  fastify.get<{
    Querystring: {
      force?: string;
      types?: string;
    };
  }>("/bouncer/all", async request => {
    const bouncers = await getBouncers(request.query.force === "TRUE");
    const types = request.query.types?.split(";").map(i => meta.getIconId(i));
    if (types) {
      const typesSet = new Set(types);
      return { bouncers: bouncers.filter(i => typesSet.has(i.iconId)), types: [...typesSet] };
    }
    return { bouncers };
  });
}
