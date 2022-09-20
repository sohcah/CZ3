import { FastifyInstance } from "fastify";
import { getBouncers } from "../../utils/bouncers.js";
import distance from "@turf/distance";
import { point } from "@turf/helpers";

async function loadBouncersRadius(parameters: {
  latitude?: string;
  longitude?: string;
  radius?: string;
  force?: string;
}) {
  const latitude = parameters.latitude ? Number(parameters.latitude) : null;
  const longitude = parameters.longitude ? Number(parameters.longitude) : null;
  const radius = parameters.radius ? Number(parameters.radius) : null;
  if (!latitude || !longitude || !radius) {
    return { error: "Missing latitude, longitude or radius" };
  }
  const pt = point([longitude, latitude]);
  const bouncers = await getBouncers(parameters.force === "TRUE");
  return bouncers
    .map(i => {
      return {
        ...i,
        distance: distance(point([Number(i.longitude), Number(i.latitude)]), pt, {
          units: "meters",
        }),
      };
    })
    .filter(i => i.distance <= radius);
}

export default function BouncerRadius(fastify: FastifyInstance) {
  fastify.get<{
    Querystring: {
      latitude?: string;
      longitude?: string;
      radius?: string;
      force?: string;
    };
  }>("/bouncer/radius", async request => {
    return { bouncers: await loadBouncersRadius(request.query) };
  });
}
