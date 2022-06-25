import { ParameterlessEndpointBase, Response } from "../common";

export interface UserBoostersCredits extends ParameterlessEndpointBase {
  path: "user/boosters/credits";
  response: Response<{
    [key: string]: {
      type_id: string;
      name: string;
      short_name: string;
      credits: number;
    };
  }>;
}

export interface UserBoostersActive extends ParameterlessEndpointBase {
  path: "user/boosters/active";
  response: Response<{
    items: unknown[];
  }>;
}
