import { EndpointBase, Response } from "./common";

export interface Template extends EndpointBase {
  path: "template";
  params: {
    key: string;
  };
  response: Response<{
    value: number;
  }>;
}
