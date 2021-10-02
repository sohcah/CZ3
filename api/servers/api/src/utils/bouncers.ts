import { MunzeeSpecial } from "@cuppazee/api/munzee/specials";

import pr from "power-radix";
import { MunzeeBouncer } from "../../../../packages/api/munzee/bouncers";
import { Response } from "../../../../packages/api/common";
import { authenticateAnonymous } from "./auth";
import config from "./config";
import { munzeeFetch } from "./munzee";
const b64e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");

function generateBouncerHash(id: number, timestamp: number) {
  return `${new pr(id, 10).toString(b64e).padStart(5, "A").slice(0, 5)}${new pr(
    timestamp % 172800,
    10
  )
    .toString(b64e)
    .padStart(3, "A")
    .slice(0, 3)}`;
}

export const cache: {
  bouncers: ((MunzeeSpecial | MunzeeBouncer) & {
    hash: string;
    group:
      | "regular"
      | "mythological"
      | "pouch_creature"
      | "flat"
      | "temp"
      | "retired"
      | "tob";
  })[];
  bouncers_updated: number;
  loading: Promise<unknown> | null;
  loading_at: number;
} = {
  bouncers: [],
  bouncers_updated: 0,
  loading: null,
  loading_at: 0,
};

const Endpoints: any = {};

const groups = [
  ["munzee/specials", {}, "regular", Endpoints.MunzeeSpecials],
  ["munzee/specials/mythological", {}, "mythological", Endpoints.MunzeeSpecialsMythological],
  ["munzee/specials/pouchcreatures", {}, "pouch_creature", Endpoints.MunzeeSpecialsPouchcreatures],
  ["munzee/specials/flat", {}, "flat", Endpoints.MunzeeSpecialsFlat],
  ["munzee/specials/retired", {}, "retired", Endpoints.MunzeeSpecialsRetired],
  ["munzee/specials/bouncers", {}, "temp", Endpoints.MunzeeSpecialsBouncers],
] as const;

async function loadBouncers() {
  const token = await authenticateAnonymous(config.applications.universal);
  const data = await Promise.all<Response<MunzeeSpecial[]> | Response<MunzeeBouncer[]> | null>([
    ...groups.map(async group => {
      try {
        const response = await munzeeFetch({ endpoint: group[0], params: group[1], token });
        return await response.getMunzeeData();
      } catch {
        return null;
      }
    }),
  ]);
  let body: ((MunzeeSpecial | MunzeeBouncer) & {
    hash: string;
    group: "regular" | "mythological" | "pouch_creature" | "flat" | "temp" | "retired" | "tob";
  })[] = [];
  let n = 0;
  for (let endpointData of data) {
    body = body.concat(
      ((endpointData?.data ?? []) as (MunzeeSpecial | MunzeeBouncer)[]).map(i => ({
        ...i,
        hash: generateBouncerHash(
          Number("mythological_munzee" in i ? i.mythological_munzee.munzee_id : i.munzee_id),
          i.special_good_until
        ),
        group: groups[n][2],
      }))
    );
    n++;
  }
  const hashes = new Set<string>();
  cache.bouncers = body.filter(i => {
    if (hashes.has(i.hash)) return false;
    hashes.add(i.hash);
    return true;
  });
  cache.bouncers_updated = Date.now();
}

export async function getBouncers(force?: boolean) {
  if (force || cache.bouncers_updated < Date.now() - 300000) {
    if (cache.loading && cache.loading_at > Date.now() - 90000) {
      await cache.loading;
    } else {
      cache.loading = Promise.race<unknown>([
        loadBouncers(),
        new Promise(r => {
          setTimeout(r, 90000);
        }),
      ]);
      cache.loading_at = Date.now();
      await cache.loading;
    }
  }
  return cache.bouncers;
}
