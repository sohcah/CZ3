import { api } from "./trpc/api.js";

export interface StandardisedBouncer {
  host: {
    munzee_id: string;
    latitude: string;
    longitude: string;
    friendly_name: string;
    full_url: string;
  };
  bouncer:
    | { logo: string }
    | {
        logo: string;
        friendly_name: string;
        code: string;
        creator_user_id: string;
        creator_username: string;
        munzee_id: string;
        capture_type_id: string;
      };
  time_placed: string;
  special_good_until: number;
}

const { bouncers } = await api.query("bouncer:list");

const standardBouncers: StandardisedBouncer[] = bouncers.map(bouncer => ({
  host: {
    munzee_id: bouncer.munzee_id,
    latitude: bouncer.latitude,
    longitude: bouncer.longitude,
    friendly_name: bouncer.friendly_name,
    full_url: bouncer.full_url,
  },
  bouncer:
    "logo" in bouncer
      ? { logo: bouncer.logo }
      : {
          logo: bouncer.mythological_munzee.munzee_logo,
          friendly_name: bouncer.mythological_munzee.friendly_name,
          code: bouncer.mythological_munzee.code,
          creator_user_id: bouncer.mythological_munzee.creator_user_id,
          creator_username: bouncer.mythological_munzee.creator_username,
          munzee_id: bouncer.mythological_munzee.munzee_id,
          capture_type_id: bouncer.mythological_munzee.capture_type_id,
        },
  time_placed: bouncer.time_placed,
  special_good_until: bouncer.special_good_until,
}));

console.log(new Set(standardBouncers.map(i => i.bouncer.logo)));
