import { EndpointBase, Response } from "../../common";

export interface StatzeePlayerCapturesTypes extends EndpointBase {
  path: "statzee/player/captures/types";
  params: {
    username: string;
  };
  response: Response<{
    types: {
      captures: string;
      points: string;
      average: string;
      capture_type_id: string;
      name: string;
    }[];
    total_points: number;
  }>;
}
export interface StatzeePlayerCaptures extends EndpointBase {
  path: "statzee/player/captures";
  params: {
    username: string;
  };
  response: Response<{
    [date: string]: number;
  }>;
}
