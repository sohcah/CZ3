import { FastifyInstance } from "fastify";
import { APIError } from "../../api";
import { getBouncers } from "../../utils/bouncers";

const validateParameter = (v: string) =>
  !Number.isNaN(Number(v))
    ? (() => {
        throw APIError.InvalidRequest();
      })()
    : Number(v);

export default function BouncerBounds(fastify: FastifyInstance) {
  fastify.get<{
    Querystring: {
      lat1: string;
      lat2: string;
      lng1: string;
      lng2: string;
    };
  }>("/bouncer/bounds", async request => {
    const lat1 = validateParameter(request.query.lat1);
    const lat2 = validateParameter(request.query.lat2);
    const lng1 = validateParameter(request.query.lng1);
    const lng2 = validateParameter(request.query.lng2);
    const latMin = Math.min(lat1, lat2);
    const lngMin = Math.min(lng1, lng2);
    const latMax = Math.max(lat1, lat2);
    const lngMax = Math.max(lng1, lng2);
    const bouncers = await getBouncers();
    return {
      bouncers: bouncers.filter(
        i =>
          Number(i.latitude) >= latMin &&
          Number(i.latitude) <= latMax &&
          Number(i.longitude) >= lngMin &&
          Number(i.longitude) <= lngMax
      ),
    };
  });
}
