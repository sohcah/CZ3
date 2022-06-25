import { ParameterlessEndpointBase, Response } from "../common";

export interface MunzeeSpecial {
  munzee_id: string;
  logo: string;
  latitude: string;
  longitude: string;
  friendly_name: string;
  time_placed: string;
  full_url: string;
  special_good_until: number;
}

export interface MunzeeSpecialBouncer {
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

export interface MunzeeSpecials extends ParameterlessEndpointBase {
  path: "munzee/specials";
  response: Response<MunzeeSpecial[]>;
}

export interface MunzeeSpecialsMythological extends ParameterlessEndpointBase {
  path: "munzee/specials/mythological";
  response: Response<MunzeeSpecialBouncer[]>;
}

export interface MunzeeSpecialsPouchCreatures extends ParameterlessEndpointBase {
  path: "munzee/specials/pouchcreatures";
  response: Response<MunzeeSpecialBouncer[]>;
}

export interface MunzeeSpecialsRetired extends ParameterlessEndpointBase {
  path: "munzee/specials/retired";
  response: Response<MunzeeSpecialBouncer[]>;
}

export interface MunzeeSpecialsFlat extends ParameterlessEndpointBase {
  path: "munzee/specials/flat";
  response: Response<MunzeeSpecialBouncer[]>;
}

export interface MunzeeSpecialsBouncers extends ParameterlessEndpointBase {
  path: "munzee/specials/bouncers";
  response: Response<MunzeeSpecialBouncer[]>;
}
