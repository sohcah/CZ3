import { FastifyInstance } from "fastify";
import { munzeeFetch } from "../../utils/munzee";



// interface InventoryHistoryEntry { 
  
// }

export default function PlayerInventory(fastify: FastifyInstance) {
  fastify.get("/player/:user/inventory_raw", async (request, reply) => {
    const access_token = await request.authenticateHeaders();

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
  fastify.get("/player/:user/inventory", async (request, reply) => {
    const access_token = await request.authenticateHeaders();

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
