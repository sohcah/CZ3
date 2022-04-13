import { TypeState } from "@cz3/meta-client";
import { PlayerActivityItem } from "../data/activity.js";
import { meta } from "../meta.js";

export enum LegacyPlayerActivityType {
  Capture = "capture",
  Deploy = "deploy",
  Capon = "capon",
  PassiveDeploy = "passive_deploy",
  PassiveCapture = "passive_capture",
}

export interface LegacyPlayerActivityItem {
  key: string;
  type: LegacyPlayerActivityType;
  creator?: string;
  capper?: string;
  code: string;
  name: string;
  icon: string;
  points: number;
  sub_captures?: LegacyPlayerActivityItem[];
  time: string;
  group_capture?: boolean;
  sub?: boolean;
  munzee_type?: string;
}

export interface LegacyPlayerActivityOverviewType {
  points: number;
  count: number;
  types: {
    [icon: string]: {
      points: number;
      count: number;
    };
  };
}

export interface LegacyPlayerActivityData {
  categories: string[];
  list: LegacyPlayerActivityItem[];
  points: number;
  overview: {
    [t: string]: LegacyPlayerActivityOverviewType;
  };
}

export interface LegacyPlayerActivityFilters {
  activity: LegacyPlayerActivityType[];
  state: TypeState[];
  category: string[];
}

export function getLegacyPlayerActivity(
  activity: PlayerActivityItem[],
  filters: LegacyPlayerActivityFilters
): LegacyPlayerActivityData {
  const legacyItems: LegacyPlayerActivityItem[] = [];

  const legacyItemsWithParents = [];

  for (const item of activity) {
    const legacyItem: LegacyPlayerActivityItem = {
      capper: "capper_username" in item ? item.capper_username : undefined,
      code: item.munzee.code.toString(),
      creator: item.munzee.username,
      // Old internal
      group_capture: undefined,
      icon: item.icon.slice("https://images.cuppazee.app/types/64/".length, -".png".length),
      key: item.key,
      munzee_type: item.munzee.type,
      name: item.munzee.name,
      points: item.points,
      sub: !!item.parent,
      sub_captures: undefined,
      time: item.time.toISOString(),
      type: {
        capture: LegacyPlayerActivityType.Capture,
        deploy: LegacyPlayerActivityType.Deploy,
        capon: LegacyPlayerActivityType.Capon,
        passive_deploy: LegacyPlayerActivityType.PassiveDeploy,
        passive_capture: LegacyPlayerActivityType.PassiveCapture,
      }[item.type],
    };
    if (!item.parent) {
      legacyItems.push(legacyItem);
    } else {
      legacyItemsWithParents.push({
        parent: item.parent,
        legacyItem,
      });
    }
  }

  for (const item of legacyItemsWithParents) {
    const parent = legacyItems.find(i => i.key === item.parent) as LegacyPlayerActivityItem;
    if (parent) {
      parent.sub_captures ??= [];
      parent.sub_captures.push(item.legacyItem);
    }
  }

  const legacy: LegacyPlayerActivityData = {
    categories: [],
    list: legacyItems
      .filter(i => {
        return [i, ...(i.sub_captures ?? [])].some(item => {
          if (!filters) return true;
          if (filters.activity.length !== 0 && !filters.activity.includes(item.type)) return false;
          if (!item.munzee_type) return true;
          const g = meta.get(item.munzee_type);
          if (!g) return true;
          if (filters.state.length !== 0 && !filters.state.includes(g.state)) return false;
          if (
            filters.category.length !== 0 &&
            (!g.groups[0] || !filters.category.includes(g.groups[0]?.humanId))
          )
            return false;
          return true;
        });
      })
      .sort((a, b) => new Date(b.time).valueOf() - new Date(a.time).valueOf()),
    points: 0,
    overview: {},
  };

  for (const item of legacy.list.flatMap(i => [i, ...(i.sub_captures ?? [])])) {
    legacy.points += item.points;

    if (!item.munzee_type) continue;
    const group = meta.get(item.munzee_type)?.groups?.[0];
    if (!group) continue;
    if (!legacy.categories.includes(group.humanId)) {
      legacy.categories.push(group.humanId);
    }
  }

  for (const item of legacy.list.flatMap(i => [i, ...(i.sub_captures ?? [])])) {
    if (!legacy.overview[item.type])
      legacy.overview[item.type] = {
        points: 0,
        count: 0,
        types: {},
      };
    const o = legacy.overview[item.type];

    legacy.overview[item.type] = {
      points: o.points + item.points,
      count: o.count + 1,
      types: {
        ...o.types,
        [item.icon]: {
          points: (o.types[item.icon]?.points || 0) + item.points,
          count: (o.types[item.icon]?.count || 0) + 1,
        },
      },
    };
  }

  return legacy;
}
