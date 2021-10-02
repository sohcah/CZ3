import { FastifyInstance } from "fastify";
import { getBouncers } from "../../utils/bouncers";

export default function BouncerOverview(fastify: FastifyInstance) {
  fastify.get("/bouncer/overview", async () => {
    const bouncers = await getBouncers();
    const overview = bouncers.reduce((a, b) => {
      const logo =
        (("mythological_munzee" in b ? b.mythological_munzee.munzee_logo : b.logo) ||
        "https://munzee.global.ssl.fastly.net/images/pins/undefined.png").slice(49, -4);
      a[logo] = (a[logo] || 0) + 1;
      return a;
    }, {} as { [key: string]: number });
    return { overview };
  });
}
