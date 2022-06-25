import { EndpointBase, Response } from "../../common";

export interface StatzeePlayerDeploysTypes extends EndpointBase {
  path: "statzee/player/deploys/types";
  params: {
    username: string;
  };
  response: Response<{
    types: {
      munzees: string;
      points: string;
      capture_type_id: string;
      name: string;
      captures: string;
      cap_on_points: string;
      combined_points: number;
    }[];
    total_points: number;
  }>;
}
export interface StatzeePlayerDeploys extends EndpointBase {
  path: "statzee/player/deploys";
  params: {
    username: string;
  };
  response: Response<{
    [date: string]: number;
  }>;
}
