import { EndpointBase, Response } from "../common";

export interface MunzeeBouncer {
  munzee_id: string;
  latitude: string;
  longitude: string;
  friendly_name: string;
  time_placed: string;
  full_url: string;
  mythological_munzee: {
    friendly_name: string;
    code: string;
    creator_user_id: string;
    creator_username: string;
    munzee_id: string;
    munzee_logo: string;
    capture_type_id: string;
  };
  special_good_until: number;
}

export type MunzeeBouncerGroup =
  | "mythological"
  | "pouch_creature"
  | "flat"
  | "evo"
  | "garden_gnome"
  | "mechz"
  | "clan"
  | "temp"
  | "retired"
  | "tob";

export interface MunzeeBouncers extends EndpointBase {
  path: "munzee/bouncers";
  params: {
    group: MunzeeBouncerGroup;
  };
  response: Response<MunzeeBouncer[]>;
}
