import { EndpointBase, Response } from "../common";

export interface Cubimal {
  id: string;
  name: string;
  description: string;
  logo: string;
  collected: number;
}

export interface UserCubimals extends EndpointBase {
  path: "user/cubimals";
  params: {
    method?: "get";
  };
  response: Response<Cubimal[]>;
}
