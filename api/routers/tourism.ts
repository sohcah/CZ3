import { z } from "zod";
import { createRouter } from "./index.js";
import { meta } from "../utils/meta.js";

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
  items: TourismItem[];
}

const sections: TourismSection[] = [
  {
    name: "Golden Tickets",
    id: "golden_tickets",
    items: [
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
        items: section.items.map(i => ({
          ...i,
          icon: meta.getIcon(i.icon),
        })),
      };
    },
  });
