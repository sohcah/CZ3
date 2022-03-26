import { nanoid } from "nanoid";
import { StatzeePlayerDay } from "@cuppazee/api/statzee/player/day";

export type UserActivityMunzee =
  | {
      username: string;
      code: number;
    }
  | {
      munzee_id: number;
    };

export interface BaseUserActivityItem {
  parent?: string;
  key: string;
  icon: string;
  points: number;
  time: string;
}
interface internal__BaseUserActivityItem extends BaseUserActivityItem {
  __internal: {
    bouncer_base?: boolean;
  };
}

export interface UserActivityCaptureItem extends BaseUserActivityItem {
  type: "capture";
  creator_username: string;
  munzee: UserActivityMunzee;
}
interface internal__UserActivityCaptureItem
  extends UserActivityCaptureItem,
    internal__BaseUserActivityItem {}

export interface UserActivityCaptureOnItem extends BaseUserActivityItem {
  type: "capon";
  capper_username: string;
  munzee: UserActivityMunzee;
}
interface internal__UserActivityCaptureOnItem
  extends UserActivityCaptureOnItem,
    internal__BaseUserActivityItem {}

export interface UserActivityDeployItem extends BaseUserActivityItem {
  type: "deploy";
  munzee: UserActivityMunzee;
}

interface internal__UserActivityDeployItem
  extends UserActivityDeployItem,
    internal__BaseUserActivityItem {}

export interface UserActivityPassiveDeployItem extends BaseUserActivityItem {
  type: "passive_deploy";
  munzee: UserActivityMunzee;
}

interface internal__UserActivityPassiveDeployItem
  extends UserActivityPassiveDeployItem,
    internal__BaseUserActivityItem {}

export interface UserActivityPassiveCaptureItem extends BaseUserActivityItem {
  type: "passive_capture";
  creator_username: string;
  munzee: UserActivityMunzee;
}

interface internal__UserActivityPassiveCaptureItem
  extends UserActivityPassiveCaptureItem,
    internal__BaseUserActivityItem {}

export type UserActivityItem =
  | UserActivityCaptureItem
  | UserActivityDeployItem
  | UserActivityPassiveCaptureItem
  | UserActivityPassiveDeployItem
  | UserActivityCaptureOnItem;

export type internal__UserActivityItem =
  | internal__UserActivityCaptureItem
  | internal__UserActivityPassiveCaptureItem
  | internal__UserActivityDeployItem
  | internal__UserActivityPassiveDeployItem
  | internal__UserActivityCaptureOnItem;

export function GenerateUserActivity(
  username: string,
  playerDay: StatzeePlayerDay["response"]["data"]
): UserActivityItem[] {
  if (!playerDay) throw new Error("Player day is null");
  const activity: internal__UserActivityItem[] = [];

  for (const deploy of playerDay.deploys) {
    const isPassive = false;
    activity.push({
      key: nanoid(),
      munzee: {
        username: username,
        code: Number(deploy.code),
      },
      icon: deploy.pin,
      points: Number(deploy.points),
      time: deploy.deployed_at,
      type: isPassive ? "passive_deploy" : "deploy",
      __internal: {},
    });
  }

  for (const capture of playerDay.captures) {
    const isPassive = false;
    activity.push({
      key: nanoid(),
      munzee: {
        username: capture.username,
        code: Number(capture.code),
      },
      icon: capture.pin,
      points: Number(capture.points),
      time: capture.captured_at,
      type: isPassive ? "passive_capture" : "capture",
      creator_username: capture.username,
      __internal: {
        bouncer_base: false,
      },
    });
  }

  for (const capon of playerDay.captures_on) {
    activity.push({
      key: nanoid(),
      munzee: {
        username,
        code: Number(capon.code),
      },
      icon: capon.pin,
      points: Number(capon.points),
      time: capon.captured_at,
      type: "capon",
      capper_username: capon.username,
      __internal: {
        bouncer_base: false,
      },
    });
  }

  return activity
    .map<UserActivityItem>(({ __internal, ...item }) => item)
    .sort((a, b) => new Date(b.time).valueOf() - new Date(a.time).valueOf());
}
