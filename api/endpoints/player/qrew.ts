import dayjs, { Dayjs } from "dayjs";
import { FastifyInstance } from "fastify";
import { authenticateWithUserID } from "../../utils/auth/index.js";
import { munzeeFetch } from "../../utils/munzee.js";
import { APIError } from "../../api.js";

export interface CuppaZeeQRewData {
  start: Dayjs;
  end: Dayjs;
  zeeqrew: {
    premium: boolean;
    lifetime_physical_deploy: number;
    lifetime_score: number;
    timeframe_capture: boolean;
    timeframe_deploy: boolean;
  };
  qrew: {
    premium: boolean;
    lifetime_deploy: number;
    timeframe_capture: boolean;
    timeframe_deploy: boolean;
  };
}

function stringOrBooleanToNumber(
  value: string | boolean,
  trueValue: number,
  falseValue = 0
): number {
  if (typeof value === "boolean") {
    return value ? trueValue : falseValue;
  }
  return Number(value.split("/")[0]);
}

export default function PlayerZeeQRew(fastify: FastifyInstance) {
  fastify.get<{
    Params: { day: string };
  }>("/player/:user/zeeqrew", async request => {
    const user_id = await request.getUserID();
    const authenticationResult = await authenticateWithUserID(user_id);
    const response = await munzeeFetch({
      endpoint: "user/zeeqrew",
      method: "GET",
      params: {
        user_id: user_id,
      },
      token: authenticationResult.access_token,
    });
    const munzeeData = (await response.getMunzeeData()).data;

    if (!munzeeData) {
      throw APIError.MunzeeInvalid();
    }

    let start, end;
    const tfs = munzeeData.timeframe.split(" ");
    const year = new Date().getFullYear();
    if (munzeeData.timeframe.match("last 14 days")) {
      start = dayjs(`1 ${tfs[4]} ${year}`).add(1, "month").subtract(15, "day");
      end = dayjs(`1 ${tfs[4]} ${year}`).add(1, "month");
    } else {
      start = dayjs(`${tfs[0]} ${tfs[1].slice(0, -2)} ${year}`);
      end = dayjs(`${tfs[0]} ${tfs[3].slice(0, -2)} ${year}`).add(1, "day");
    }

    const data: CuppaZeeQRewData = {
      start,
      end,
      zeeqrew: {
        premium: munzeeData.zeeqrew_requirements.premium_requirement,
        lifetime_physical_deploy: stringOrBooleanToNumber(
          munzeeData.zeeqrew_requirements.lifetime_physical_deploy_requirement,
          250
        ),
        lifetime_score: stringOrBooleanToNumber(
          munzeeData.zeeqrew_requirements.lifetime_score_requirement,
          100000
        ),
        timeframe_capture: !!stringOrBooleanToNumber(
          munzeeData.zeeqrew_requirements.timeframe_capture_requirement,
          1
        ),
        timeframe_deploy: !!stringOrBooleanToNumber(
          munzeeData.zeeqrew_requirements.timeframe_deploy_requirement,
          1
        ),
      },
      qrew: {
        premium: munzeeData.qrew_requirements.premium_requirement,
        lifetime_deploy: stringOrBooleanToNumber(
          munzeeData.qrew_requirements.lifetime_deploy_requirement,
          100
        ),
        timeframe_capture: !!stringOrBooleanToNumber(
          munzeeData.qrew_requirements.timeframe_capture_requirement,
          1
        ),
        timeframe_deploy: !!stringOrBooleanToNumber(
          munzeeData.qrew_requirements.timeframe_deploy_requirement,
          1
        ),
      },
    };
    return data;
  });
}
