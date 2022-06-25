import { ParameterlessEndpointBase, Response } from "../common";

export interface UserCredits extends ParameterlessEndpointBase {
  path: "user/credits";
  response: Response<{
    [key: string]: string;
  }>;
}

export interface UserCreditsHistory extends ParameterlessEndpointBase {
  path: "user/credits/history";
  response: Response<{
    items: {
      type: string;
      time_awarded: string;
      log_text: string;
    }[];
  }>;
}
