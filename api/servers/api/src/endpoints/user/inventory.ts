import { FastifyInstance } from "fastify";
import { APIError } from "../../api";
import { munzeeFetch } from "../../utils/munzee";

export default function UserInventory(fastify: FastifyInstance) {
  fastify.get<{
    Querystring: {
      access_token?: string;
    };
  }>("/user/inventory", async (request, reply) => {
    if (!request.query.access_token) {
      throw APIError.InvalidRequest();
    }
    const access_token = request.query.access_token;

    const [undeployed, credits, history, boosters] = await Promise.all([
      (async () =>
        await (
          await munzeeFetch({ endpoint: "user/undeploys/count", token: access_token, params: {} })
        ).getMunzeeData())(),
      (async () =>
        await (
          await munzeeFetch({ endpoint: "user/credits", token: access_token, params: {} })
        ).getMunzeeData())(),
      (async () =>
        await (
          await munzeeFetch({ endpoint: "user/credits/history", token: access_token, params: {} })
        ).getMunzeeData())(),
      (async () =>
        await (
          await munzeeFetch({ endpoint: "user/boosters/credits", token: access_token, params: {} })
        ).getMunzeeData())(),
    ] as const);
    const formattedUndeployed =
      undeployed?.data?.map(i => ({
        type: i.pin_icon.match(/\/([^./]+).png/)?.[1],
        amount: i.count,
      })) ?? [];
    return {
      credits: credits?.data,
      history: history?.data,
      boosters: boosters?.data,
      undeployed: formattedUndeployed,
    };
  });
}
