import { EndpointBase, Response } from "../common";

export interface UserFind extends EndpointBase {
  path: "user/find";
  params: {
    text: string;
    limit?: number;
  };
  response: Response<{
    users: { user_id: string; username: string }[];
    too_many: 1;
  }>;
}
