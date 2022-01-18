import { FastifyInstance } from "fastify";
import { MinimumAuthenticationResult } from "../../utils/auth";
import { munzeeFetch } from "../../utils/munzee";

async function getUndeployed(token: MinimumAuthenticationResult) {
  const undeployed = [];
  for (let page = 0; page < 100; page++) {
    const response = await munzeeFetch({
      endpoint: "user/undeploys",
      params: {page},
      token,
    });
    const data = await response.getMunzeeData();
    if (!data.data) break;
    for (const undeploy of data.data.munzees) {
      undeployed.push(undeploy);
    }
    if (!data.data.has_more) break;
  }
  return undeployed;
}

export default function PlayerUndeployed(fastify: FastifyInstance) {
  fastify.get<{
    Params: { game_id: string };
  }>("/player/:user/undeployed", async (request, reply) => {
    const token = await request.authenticateHeaders();
    return await getUndeployed(token);
  });
  fastify.get<{
    Params: { game_id: string };
  }>("/player/:user/undeployed/withcoordinates", async (request, reply) => {
    const token = await request.authenticateHeaders();
    return (await getUndeployed(token)).filter(i => i.latitude !== "0" || i.longitude !== "0");
  });
}
