import { z } from "zod";
import { createRouter } from "./index.js";
import { meta } from "../utils/meta.js";
import { Cacher } from "../utils/cacher.js";
import { authenticateAnonymous } from "../utils/auth/index.js";
import { munzeeFetch } from "../utils/munzee.js";
import { UserDeploys, UserDeploysMap } from "@cz3/api-types/user/deploys";

export interface TourismItem {
  id: number;
  name: string;
  icon: string;
  latitude: number;
  longitude: number;
  url: string;
}

export interface TourismSection {
  name: string;
  id: string;
  items: Cacher<TourismItem[]>;
}

async function loadFromDeploys(
  user_id: number,
  filter: (item: NonNullable<UserDeploys["response"]["data"]>["munzees"][number]) => boolean = () =>
    true
) {
  const token = await authenticateAnonymous();
  const munzees = [];
  for (let i = 0; i < 25; i++) {
    const response = await munzeeFetch({
      endpoint: "user/deploys",
      params: {
        user_id,
        page: i,
      },
      token,
    });
    const data = await response.getMunzeeData();
    munzees.push(...(data.data?.munzees ?? []));
    if(!data.data?.has_more) break;
  }
  return (
    munzees.filter(filter).map<TourismItem>(deploy => ({
      id: Number(deploy.munzee_id),
      name: deploy.friendly_name,
      icon: deploy.pin_icon,
      latitude: Number(deploy.latitude),
      longitude: Number(deploy.longitude),
      url: `https://munzee.com${deploy.url}`,
    })) ?? []
  );
}

async function loadFromDeploysMap(
  user_id: number,
  filter: (item: NonNullable<UserDeploysMap["response"]["data"]>[number]) => boolean = () => true
) {
  const token = await authenticateAnonymous();
  const response = await munzeeFetch({
    endpoint: "user/deploys/map",
    params: {
      user_id,
    },
    token,
  });
  const data = await response.getMunzeeData();
  return (
    data.data?.filter(filter).map<TourismItem>(deploy => ({
      id: Number(deploy.id),
      name: deploy.n,
      icon: deploy.i,
      latitude: Number(deploy.la),
      longitude: Number(deploy.lo),
      url: `https://munzee.com${deploy.u}`,
    })) ?? []
  );
}

const sections: TourismSection[] = [
  {
    name: "Golden Tickets",
    id: "golden_tickets",
    items: new Cacher(
      () => [
        {
          id: 193095240,
          name: "Aussie first golden ticket",
          icon: "https://munzee.global.ssl.fastly.net/images/pins/goldenticket.png",
          latitude: -38.451353683728,
          longitude: 145.24001439697,
          url: "https://munzee.com/m/valmie/20155/",
        },
        {
          id: 197581895,
          name: "🍫⭐ Hahndorf Golden Ticket ⭐🍫",
          icon: "https://munzee.global.ssl.fastly.net/images/pins/goldenticket.png",
          latitude: -37.894179701489,
          longitude: 145.31061406189,
          url: "https://munzee.com/m/Obi-Cal/34417/",
        },
        {
          id: 200122866,
          name: "Drew’s Golden Ticket 🎫",
          icon: "https://munzee.global.ssl.fastly.net/images/pins/goldenticket.png",
          latitude: -33.722661859959,
          longitude: 151.09305202879,
          url: "https://munzee.com/m/drew637/18373/",
        },
        {
          id: 206307475,
          name: "Under power box",
          icon: "https://munzee.global.ssl.fastly.net/images/pins/goldenticket.png",
          latitude: -27.4396267,
          longitude: 152.9856598,
          url: "https://munzee.com/m/Questing4/13854/",
        },
        {
          id: 190756958,
          name: "This IS the The Golden Ticket You Are Looking For",
          icon: "https://munzee.global.ssl.fastly.net/images/pins/goldenticket.png",
          latitude: 32.720457371355,
          longitude: -97.552690794782,
          url: "https://munzee.com/m/denali0407/25797/",
        },
        {
          id: 192392630,
          name: "Ray's Golden Ticket",
          icon: "https://munzee.global.ssl.fastly.net/images/pins/goldenticket.png",
          latitude: 33.3883447,
          longitude: -111.687171,
          url: "https://munzee.com/m/piesciuk/7345/",
        },
        {
          id: 194809735,
          name: "Signal Board ",
          icon: "https://munzee.global.ssl.fastly.net/images/pins/goldenticket.png",
          latitude: 37.478987567025,
          longitude: 126.65135756437,
          url: "https://munzee.com/m/ohmaneel/6863/",
        },
        {
          id: 192568195,
          name: "The Jolly Golden Ticket",
          icon: "https://munzee.global.ssl.fastly.net/images/pins/goldenticket.png",
          latitude: 41.034658563502,
          longitude: -83.640690595917,
          url: "https://munzee.com/m/arts5/34419/",
        },
        {
          id: 190837041,
          name: "🎫🌟 Golden Ticket 🌟🎫",
          icon: "https://munzee.global.ssl.fastly.net/images/pins/goldenticket.png",
          latitude: 42.275924727959,
          longitude: -71.804933878024,
          url: "https://munzee.com/m/lynnslilypad/22411/",
        },
        {
          id: 190939692,
          name: "Columbia Tech Center Park Golden Ticket",
          icon: "https://munzee.global.ssl.fastly.net/images/pins/goldenticket.png",
          latitude: 45.6148434,
          longitude: -122.4948634,
          url: "https://munzee.com/m/mars00xj/18873/",
        },
        {
          id: 192201888,
          name: "CHOCOLATE SHOP LINDT&SPRÜNGLI ",
          icon: "https://munzee.global.ssl.fastly.net/images/pins/goldenticket.png",
          latitude: 47.363942635897,
          longitude: 7.9166712810219,
          url: "https://munzee.com/m/hrothgar71/512/",
        },
        {
          id: 192626202,
          name: "Golden Ticket 🎫 [🇭🇺] #1886",
          icon: "https://munzee.global.ssl.fastly.net/images/pins/goldenticket.png",
          latitude: 47.4792301,
          longitude: 19.1094734,
          url: "https://munzee.com/m/iytam/1886/",
        },
        {
          id: 191388401,
          name: "🌟🎫 Golden Ticket 🎫🌟",
          icon: "https://munzee.global.ssl.fastly.net/images/pins/goldenticket.png",
          latitude: 49.0043982,
          longitude: 8.4459273,
          url: "https://munzee.com/m/lammy/9432/",
        },
        {
          id: 192583095,
          name: "Jobok’s Golden Ticket",
          icon: "https://munzee.global.ssl.fastly.net/images/pins/goldenticket.png",
          latitude: 50.033906747838,
          longitude: -110.68932357003,
          url: "https://munzee.com/m/Jobok/14184/",
        },
        {
          id: 191020053,
          name: "Moo’s Golden Ticket",
          icon: "https://munzee.global.ssl.fastly.net/images/pins/goldenticket.png",
          latitude: 51.31709771797,
          longitude: 0.8924353890973,
          url: "https://munzee.com/m/Maattmoo/6860/",
        },
        {
          id: 191477277,
          name: "🎫🌟 Golden Ticket 🌟🎫 @ Groningen (NL)",
          icon: "https://munzee.global.ssl.fastly.net/images/pins/goldenticket.png",
          latitude: 53.21772631908,
          longitude: 6.5875298632284,
          url: "https://munzee.com/m/cbf600/8228/",
        },
        {
          id: 192579168,
          name: "The Darlington Golden Ticket 🎫 ",
          icon: "https://munzee.global.ssl.fastly.net/images/pins/goldenticket.png",
          latitude: 54.518112379673,
          longitude: -1.5558434023068,
          url: "https://munzee.com/m/NEGeocachingSupplies/2518/",
        },
        {
          id: 194740851,
          name: "Aniara's Golden Ticket",
          icon: "https://munzee.global.ssl.fastly.net/images/pins/goldenticket.png",
          latitude: 57.698688225739,
          longitude: 11.951981080473,
          url: "https://munzee.com/m/Aniara/15089/",
        },
        {
          id: 192828984,
          name: "Golden Ticket ",
          icon: "https://munzee.global.ssl.fastly.net/images/pins/goldenticket.png",
          latitude: 60.224808137313,
          longitude: 19.574776025084,
          url: "https://munzee.com/m/Neta/6845/",
        },
        {
          id: 193610749,
          name: "Teekoon halloveeni ",
          icon: "https://munzee.global.ssl.fastly.net/images/pins/goldenticket.png",
          latitude: 62.9684191,
          longitude: 23.0439302,
          url: "https://munzee.com/m/isunisu/2491/",
        },
      ],
      Infinity
    ),
  },
  {
    name: "Whomp Nation",
    id: "whomp_nation",
    items: new Cacher(async () => {
      return (await loadFromDeploysMap(89939)).map(i => ({
        ...i,
        icon: `https://munzee.global.ssl.fastly.net/images/pins/whompnation.png`,
      }));
    }, Infinity),
  },
  {
    name: "Wayward Nation",
    id: "wayward_nation",
    items: new Cacher(async () => {
      return (await loadFromDeploysMap(82623)).map(i => ({
        ...i,
        icon: `https://munzee.global.ssl.fastly.net/images/pins/waywardnation.png`,
      }));
    }, Infinity),
  },
  {
    name: "Get Fit Munzee Trail",
    id: "get_fit_munzee_trail",
    items: new Cacher(async () => {
      return await loadFromDeploys(333523);
    }, Infinity),
  },
  {
    name: "Garfield",
    id: "garfield",
    items: new Cacher(async () => {
      return await loadFromDeploysMap(249939, deploy => deploy.i.includes("garfield"));
    }, Infinity),
  },
  {
    name: "Unique Flats",
    id: "unique_flats",
    items: new Cacher(async () => {
      return await loadFromDeploysMap(
        249939,
        deploy =>
          deploy.i.includes("mhqflat") ||
          deploy.i.includes("gettysburgflat") ||
          deploy.i.includes("towerbridgeflat")
      );
    }, Infinity),
  },
  {
    name: "InternationElles",
    id: "internationelles",
    items: new Cacher(async () => {
      return (await loadFromDeploys(412770)).map(i => ({
        ...i,
        icon: i.icon.includes("/munzee.png") ? `https://munzee.global.ssl.fastly.net/images/pins/internationelles.png` : i.icon,
      }));
    }, Infinity),
  },
  {
    name: "Road Trippin'",
    id: "road_trippin",
    items: new Cacher(async () => {
      return await loadFromDeploysMap(209401, deploy => deploy.i.includes("roadwarriors2022"));
    }, 14400000),
  },
];

export const tourismRouter = createRouter()
  .query("overview", {
    async resolve() {
      return {
        sections: sections.map(i => ({
          name: i.name,
          id: i.id,
        })),
      };
    },
  })
  .query("section", {
    input: z.object({
      section: z.string(),
    }),
    async resolve({ input }) {
      const section = sections.find(i => i.id === input.section);
      if (!section) {
        throw new Error("Invalid section");
      }
      return {
        section: {
          name: section.name,
          id: section.id,
        },
        items: (await section.items.get()).map(i => ({
          ...i,
          icon: meta.getIcon(i.icon),
        })),
      };
    },
  });
