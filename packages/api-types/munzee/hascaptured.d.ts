import { EndpointBase, Response } from "../common";

export interface MunzeeHascaptured extends EndpointBase {
  path: "munzee/hascaptured";
  params: {
    munzee_ids: string;
  };
  response: Response<{
    [key: string]: 0 | 1;
  }>;
}
