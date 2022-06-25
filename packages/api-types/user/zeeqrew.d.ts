export interface Data {
  timeframe: string;
  zeeqrew_requirements: ZeeqrewRequirements;
  qrew_requirements: QrewRequirements;
}

export interface QrewRequirements {
  premium_requirement: boolean;
  lifetime_deploy_requirement: boolean;
  timeframe_capture_requirement: boolean;
  timeframe_deploy_requirement: string;
}

export interface ZeeqrewRequirements {
  premium_requirement: boolean;
  lifetime_physical_deploy_requirement: string;
  lifetime_score_requirement: boolean;
  timeframe_capture_requirement: boolean;
  timeframe_deploy_requirement: string;
}

import { EndpointBase, Response } from "../common";

export interface UserZeeqrew extends EndpointBase {
  path: "user/zeeqrew";
  params: {
    user_id: number;
  };
  response: Response<Data>;
}
