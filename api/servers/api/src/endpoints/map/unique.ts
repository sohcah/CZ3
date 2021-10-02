import { FastifyInstance } from "fastify";
import { authenticateAnonymous, AuthenticationResult } from "../../utils/auth";
import { munzeeFetch } from "../../utils/munzee";

const uniques: {
  [key: string]: (
    token: AuthenticationResult
  ) => Promise<{ i: string; u: string; la: number; lo: number }[]>;
} = {
  internationelles: async token => {
    const response = await munzeeFetch({
      endpoint: "user/deploys/map",
      params: { user_id: 412770 },
      token,
    });
    return (
      (await response.getMunzeeData()).data?.map(({ i, u, la, lo }) => ({
        i,
        u,
        la: Number(la),
        lo: Number(lo),
      })) ?? []
    );
  },
  munzeecommunitybuilding: async token => {
    const response = await munzeeFetch({
      endpoint: "user/deploys/map",
      params: { user_id: 249939 },
      token,
    });
    return (
      (await response.getMunzeeData()).data
        ?.filter(i => {
          return (i.i.includes("flat") && !i.i.startsWith("flat")) || i.i.includes("garfield");
        })
        .map(({ i, u, la, lo }) => ({
          i,
          u,
          la: Number(la),
          lo: Number(lo),
        })) ?? []
    );
  },
  whomp: async token => {
    const response = await munzeeFetch({
      endpoint: "user/deploys/map",
      params: { user_id: 89939 },
      token,
    });
    return (
      (await response.getMunzeeData()).data?.map(({ i, u, la, lo }) => ({
        i: i.replace("munzee.png", "whompnation.png"),
        u,
        la: Number(la),
        lo: Number(lo),
      })) ?? []
    );
  },
  wayward: async token => {
    const response = await munzeeFetch({
      endpoint: "user/deploys/map",
      params: { user_id: 82623 },
      token,
    });
    return (
      (await response.getMunzeeData()).data?.map(({ i, u, la, lo }) => ({
        i: i.replace("munzee.png", "waywardnation.png"),
        u,
        la: Number(la),
        lo: Number(lo),
      })) ?? []
    );
  },
  getfit: async token => {
    const response1 = await munzeeFetch({
      endpoint: "user/deploys",
      params: { user_id: 333523, page: 0 },
      token,
    });
    const response2 = await munzeeFetch({
      endpoint: "user/deploys",
      params: { user_id: 333523, page: 1 },
      token,
    });
    return (
      [
        ...((await response1.getMunzeeData()).data?.munzees ?? []),
        ...((await response2.getMunzeeData()).data?.munzees ?? []),
      ]?.map(i => ({
        i: i.pin_icon,
        u: i.url,
        la: Number(i.latitude),
        lo: Number(i.longitude),
      })) ?? []
    );
  },
  other: async () => {
    return [
      {
        i: "https://munzee.global.ssl.fastly.net/images/pins/magic8ball.png",
        u: "/m/Tomppa71/2520",
        la: 64.217098680441,
        lo: 23.785783430453534,
      },
      {
        i: "https://cursors4.totallyfreecursors.com/thumbnails/unicorn.gif",
        u: "/m/aufbau/1271",
        la: 40.0273161136512,
        lo: -74.90662649273872,
      },
      {
        i: "https://munzee.global.ssl.fastly.net/images/pins/heart.png",
        u: "/m/batmanandrobin/1159",
        la: 42.3499750053401,
        lo: -71.07643776460952,
      },
      {
        i: "https://munzee.global.ssl.fastly.net/images/pins/onemillionth.png",
        u: "/m/Paverick/9114",
        la: 51.220892,
        lo: 4.398916,
      },
      {
        i: "https://munzee.global.ssl.fastly.net/images/pins/6millionthmunzee.png",
        u: "/m/zoekix/2575",
        la: 52.4598719,
        lo: 6.0067738,
      },
      {
        i: "https://munzee.global.ssl.fastly.net/images/pins/ice_bucket.png",
        u: "/m/patnanz/1846",
        la: 36.1593253606424,
        lo: -115.09178638458201,
      },
    ];
  }
};

export default function MapUnique(fastify: FastifyInstance) {
  fastify.get("/map/unique", async () => {
    const token = await authenticateAnonymous();
    const data = await Promise.all(Object.entries(uniques).map(async i => [i[0], await i[1](token)] as const));
    return Object.fromEntries(data);
  });
}
