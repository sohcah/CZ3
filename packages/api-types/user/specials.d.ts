import { EndpointBase, Response } from "../common";

export interface UserSpecials extends EndpointBase {
  path: "user/specials";
  params: {
    user_id: number;
  };
  response: Response<
    {
      name: string;
      logo: string;
      count: number;
    }[]
  >;
}
