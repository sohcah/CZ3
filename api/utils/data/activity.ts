import { nanoid } from "nanoid";
import {
  StatzeePlayerDay,
  StatzeePlayerDayCapture,
  StatzeePlayerDayDeploy,
} from "@cz3/api-types/statzee/player/day.js";
import { meta } from "../meta.js";

export type PlayerActivityMunzee = {
  name: string;
  username: string;
  code: number;
  type: string | undefined;
};

export interface BasePlayerActivityItem {
  parent?: string;
  key: string;
  icon: string;
  points: number;
  time: Date;
}
interface internal__BasePlayerActivityItem extends BasePlayerActivityItem {
  __internal: {
    bouncer_base?: boolean;
    destination_base?: boolean;
    destination_room?: boolean;
  };
}

export interface PlayerActivityCaptureItem extends BasePlayerActivityItem {
  type: "capture";
  creator_username: string;
  munzee: PlayerActivityMunzee;
}
interface internal__PlayerActivityCaptureItem
  extends PlayerActivityCaptureItem,
    internal__BasePlayerActivityItem {}

export interface PlayerActivityCaptureOnItem extends BasePlayerActivityItem {
  type: "capon";
  capper_username: string;
  munzee: PlayerActivityMunzee;
}
interface internal__PlayerActivityCaptureOnItem
  extends PlayerActivityCaptureOnItem,
    internal__BasePlayerActivityItem {}

export interface PlayerActivityDeployItem extends BasePlayerActivityItem {
  type: "deploy";
  munzee: PlayerActivityMunzee;
}

interface internal__PlayerActivityDeployItem
  extends PlayerActivityDeployItem,
    internal__BasePlayerActivityItem {}

export interface PlayerActivityPassiveDeployItem extends BasePlayerActivityItem {
  type: "passive_deploy";
  munzee: PlayerActivityMunzee;
}

interface internal__PlayerActivityPassiveDeployItem
  extends PlayerActivityPassiveDeployItem,
    internal__BasePlayerActivityItem {}

export interface PlayerActivityPassiveCaptureItem extends BasePlayerActivityItem {
  type: "passive_capture";
  creator_username: string;
  munzee: PlayerActivityMunzee;
}

interface internal__PlayerActivityPassiveCaptureItem
  extends PlayerActivityPassiveCaptureItem,
    internal__BasePlayerActivityItem {}

export type PlayerActivityItem =
  | PlayerActivityCaptureItem
  | PlayerActivityDeployItem
  | PlayerActivityPassiveCaptureItem
  | PlayerActivityPassiveDeployItem
  | PlayerActivityCaptureOnItem;

export type internal__PlayerActivityItem =
  | internal__PlayerActivityCaptureItem
  | internal__PlayerActivityPassiveCaptureItem
  | internal__PlayerActivityDeployItem
  | internal__PlayerActivityPassiveDeployItem
  | internal__PlayerActivityCaptureOnItem;

export type PlayerActivityType = PlayerActivityItem["type"];

export function getPlayerActivity(
  username: string,
  playerDay: StatzeePlayerDay["response"]["data"]
): PlayerActivityItem[] {
  if (!playerDay) throw new Error("Player day is null");
  const activity: internal__PlayerActivityItem[] = [];

  for (const deploy of [
    ...playerDay.deploys,
    // @ts-expect-error Needs updated typings
    ...playerDay.passive_deploys,
  ] as StatzeePlayerDayDeploy[]) {
    const type = meta.get(deploy.pin);
    const isPassive = type?.properties?.isPassiveDeploy;
    activity.push({
      key: nanoid(),
      munzee: {
        name: deploy.friendly_name,
        username: username,
        code: Number(deploy.code),
        type: type?.humanId,
      },
      icon: meta.getIcon(deploy.pin),
      points: Number(deploy.points),
      time: new Date(deploy.deployed_at),
      type: isPassive ? "passive_deploy" : "deploy",
      __internal: {
        destination_room: type?.properties?.isDestinationRoom,
      },
    });
  }

  for (const capture of [
    ...playerDay.captures,
    // @ts-expect-error Needs updated typings
    ...playerDay.passive_captures,
  ] as StatzeePlayerDayCapture[]) {
    const type = meta.get(capture.pin);
    activity.push({
      key: nanoid(),
      munzee: {
        name: capture.friendly_name,
        username: capture.username,
        code: Number(capture.code),
        type: type?.humanId,
      },
      icon: meta.getIcon(capture.pin),
      points: Number(capture.points),
      time: new Date(capture.captured_at),
      type: type?.properties?.isPassiveCapture ? "passive_capture" : "capture",
      creator_username: capture.username,
      __internal: {
        bouncer_base:
          type?.properties?.isBouncerBase ||
          !!capture.pin.match(/\/([^\/.]+?)_?(?:virtual|physical)?_?host\./),
        destination_base: type?.properties?.isDestinationBase,
        destination_room: type?.properties?.isDestinationRoom,
      },
    });
  }

  for (const capon of playerDay.captures_on) {
    const type = meta.get(capon.pin);
    activity.push({
      key: nanoid(),
      munzee: {
        name: capon.friendly_name,
        username,
        code: Number(capon.code),
        type: type?.humanId,
      },
      icon: meta.getIcon(capon.pin),
      points: Number(capon.points_for_creator),
      time: new Date(capon.captured_at),
      type: "capon",
      capper_username: capon.username,
      __internal: {
        bouncer_base: false,
      },
    });
  }

  const bouncerBases = activity.filter(item => item.__internal.bouncer_base);
  const destinationBases = activity.filter(item => item.__internal.destination_base);
  for (const item of activity) {
    // Group bouncers with bouncer base
    if (item.type === "capture" && !item.__internal.bouncer_base) {
      const bouncerBase = bouncerBases.find(
        bouncerBase => Math.abs(bouncerBase.time.valueOf() - item.time.getTime()) < 10
      );
      if (bouncerBase) {
        item.parent = bouncerBase.key;
      }
    }
    // Group capon with capture on own munzee
    if (item.type === "capon") {
      const capture = activity.find(
        act =>
          act.type === "capture" &&
          act.munzee.code === item.munzee.code &&
          act.time.getTime() === item.time.getTime() &&
          act.munzee.username === item.capper_username
      );
      if (capture) {
        item.parent = capture.key;
      }
    }
    // Group destination room captures with destination capture
    if ((item.type === "capture" || item.type === "deploy") && item.__internal.destination_room) {
      const destinationBase = destinationBases.find(
        destinationBase =>
          Math.abs(destinationBase.time.valueOf() - item.time.getTime()) < 60000 &&
          destinationBase.munzee.name === item.munzee.name.replace(/ Room #\d+/, "")
      );
      if (destinationBase) {
        item.parent = destinationBase.key;
      }
    }
  }

  return activity
    .map<PlayerActivityItem>(({ __internal, ...item }) => item)
    .sort((a, b) => new Date(b.time).valueOf() - new Date(a.time).valueOf());
}

type PlayerActivityTypeOverview = {
  [key in PlayerActivityType]: {
    count: number;
    points: number;
    types: {
      type?: string;
      icon: string;
      count: number;
      points: number;
    }[];
  };
};

export type PlayerActivityOverview = PlayerActivityTypeOverview & {
  points: number;
};

export function getPlayerActivityOverview(activity: PlayerActivityItem[]): PlayerActivityOverview {
  const overview: PlayerActivityOverview = {
    points: 0,
    deploy: {
      count: 0,
      points: 0,
      types: [],
    },
    capture: {
      count: 0,
      points: 0,
      types: [],
    },
    capon: {
      count: 0,
      points: 0,
      types: [],
    },
    passive_deploy: {
      count: 0,
      points: 0,
      types: [],
    },
    passive_capture: {
      count: 0,
      points: 0,
      types: [],
    },
  };
  for (const item of activity) {
    overview.points += item.points;
    const typeOverview = overview[item.type];
    typeOverview.count++;
    typeOverview.points += item.points;
    const munzeeType = item.munzee.type ?? item.icon;
    let type = typeOverview.types.find(i => i.type === munzeeType);
    if (!type) {
      type = {
        type: item.munzee.type,
        icon: item.icon,
        count: 0,
        points: 0,
      };
      typeOverview.types.push(type);
    }
    type.count++;
    type.points += item.points;
  }
  return overview;
}
