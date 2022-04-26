import { GroupData, GroupSeasonalProperties } from "./groups";
import { TypeData, TypeMeta, TypePoints, TypeHidden, TypeState, TypeTags } from "./types";

export {
  TypeData,
  TypeMeta,
  TypePoints,
  TypeHidden,
  TypeState,
  TypeTags,
  GroupData,
  GroupSeasonalProperties,
};

interface TypeInternalData {
  name: string;
  icons: string[];
  id: number;
  human_id: string;
  munzee_id?: number;
  state: TypeState;
  groups: (number | string)[];
  points?: TypePoints;
  tags: Set<TypeTags>;
  hidden: Set<TypeHidden>;
  meta: TypeMeta;
}

const internalTypesSymbol = Symbol();

export class Type {
  private _data: TypeInternalData;
  private _client: MetaClient;

  constructor(data: TypeData, client: MetaClient) {
    this._client = client;
    const internalDefaultIcon = data.name.toLowerCase().replace(/\s/g, "_");
    this._data = {
      name: data.name,
      icons: data.icons ?? [internalDefaultIcon],
      id: data.id,
      human_id: data.human_id ?? internalDefaultIcon,
      munzee_id: data.munzee_id,
      state: data.state!,
      groups: data.groups ?? [],
      points: data.points,
      tags: new Set(data.tags),
      hidden: new Set(data.hidden),
      meta: data.meta ?? {},
    };
  }

  get id(): number {
    return this._data.id;
  }

  get name(): string {
    return this._data.name;
  }

  get munzeeId(): number | undefined {
    return this._data.munzee_id;
  }

  get humanId(): string {
    return this._data.human_id;
  }

  get icons(): string[] {
    return this._data.icons;
  }

  get icon(): string {
    return this.icons[0];
  }

  get state(): TypeState {
    return this._data.state!;
  }

  get points(): TypePoints | undefined {
    return this._data.points;
  }

  get tags(): Set<TypeTags> {
    return this._data.tags;
  }

  hasTag(tag: TypeTags): boolean {
    return this._data.tags.has(tag);
  }

  get hidden(): Set<TypeHidden> {
    return this._data.hidden;
  }

  isHidden(hidden: TypeHidden): boolean {
    return this._data.hidden.has(hidden);
  }

  get meta(): TypeMeta {
    return this._data.meta;
  }

  get groups(): Group[] {
    return this._data.groups.map(id => this._client.getGroup(id)).filter(i => i) as Group[];
  }

  get properties(): TypeProperties {
    return new TypeProperties(this);
  }
}

export class Group {
  private _data: GroupData;
  private _client: MetaClient;

  constructor(data: GroupData, client: MetaClient) {
    this._client = client;
    this._data = data;
  }

  get id(): number {
    return this._data.id;
  }

  get name(): string {
    return this._data.name;
  }

  get humanId(): string {
    return this._data.human_id;
  }

  get icons(): string[] {
    return this._data.icons;
  }

  get icon(): string {
    return this._data.icons[0];
  }

  get seasonal(): GroupSeasonalProperties | undefined {
    return this._data.seasonal;
  }

  get parents(): Group[] {
    return this._data.parents.map(id => this._client.getGroup(id)).filter(i => i) as Group[];
  }

  [internalTypesSymbol]: Type[] = [];

  get types(): Type[] {
    return this[internalTypesSymbol];
  }
}

export class MetaClient {
  private _typesRoot!: Map<number, Type>;
  private _types!: Map<string | number, number>;
  private _groupsRoot!: Map<number, Group>;
  private _groups!: Map<string | number, number>;

  constructor(types: TypeData[], groups: GroupData[]) {
    this.loadData(types, groups);
  }

  public loadData(types: TypeData[], groups: GroupData[]) {
    this._typesRoot = new Map();
    for (const type of types) {
      this._typesRoot.set(type.id, new Type(type, this));
    }

    this._types = new Map();
    for (const type of this._typesRoot.values()) {
      this._types.set(type.name, type.id);
      if (type.munzeeId) this._types.set(type.munzeeId, type.id);
      for (const icon of type.icons) this._types.set(icon, type.id);
    }
    for (const type of this._typesRoot.values()) {
      for (const icon of type.icons) {
        const base = icon.toLowerCase().replace(/[^a-z0-9]+/g, "");
        if (this._types.has(base)) {
          this._types.set(base, type.id);
        }
      }
    }

    this._groupsRoot = new Map();
    for (const group of groups) {
      this._groupsRoot.set(group.id, new Group(group, this));
    }

    this._groups = new Map();
    for (const group of this._groupsRoot.values()) {
      this._groups.set(group.id, group.id);
      this._groups.set(group.humanId, group.id);
      this._groups.set(group.name, group.id);
      for (const icon of group.icons) this._groups.set(icon, group.id);
    }

    for (const type of this._typesRoot.values()) {
      for (const group of type.groups) {
        group[internalTypesSymbol].push(type);
      }
    }
  }

  public getIcon(id: string): string {
    let icon = this.get(id)?.icon;
    if (icon) return `https://images.cuppazee.app/types/64/${icon}.png`;
    icon = id;
    if (icon.startsWith("https://munzee.global.ssl.fastly.net/images/")) {
      if (icon.startsWith("https://munzee.global.ssl.fastly.net/images/v4pins/")) {
        icon = icon.slice(51, -4);
      } else {
        icon = icon.slice(49, -4);
      }
    }
    return `https://images.cuppazee.app/types/64/${icon}.png`;
  }

  private static *getBaseVariants(base: string) {
    // Will only lowercase A-Z to match what Munzee did for `tavaszeeszélvizetÁraszt` and `dk:jul2017(Østjylland)`
    const first = decodeURIComponent(base).replace(/[A-Z]+/g, a => a.toLowerCase());
    yield first;
    const set = new Set([first]);
    const second = base.replace(/[A-Z]+/g, a => a.toLowerCase());
    if (!set.has(second)) {
      yield second;
      set.add(second);
    }
    const third = decodeURIComponent(base).toLowerCase();
    if (!set.has(third)) {
      yield third;
      set.add(third);
    }
    const fourth = base.toLowerCase();
    if (!set.has(fourth)) {
      yield fourth;
      set.add(fourth);
    }
  }

  private static *getStrippedVariants(id: string) {
    // Strip URL prefix and suffix
    let base = id;
    if (id.startsWith("https://munzee.global.ssl.fastly.net/images/")) {
      if (id.startsWith("https://munzee.global.ssl.fastly.net/images/v4pins/")) {
        base = base.slice(51, -4);
      } else {
        base = base.slice(49, -4);
      }
    }

    for (const baseVariant of MetaClient.getBaseVariants(base)) {
      // Remove spaces
      yield baseVariant.replace(/\s/g, "");

      // Replace spaces with underscores
      yield baseVariant.replace(/\s/g, "_");

      // Remove underscores
      yield baseVariant.replace(/_/g, "");

      // Remove non-alphanumeric characters
      yield baseVariant.replace(/[^a-z0-9]/g, "");

      // Remove "munzee" text from the end
      if (baseVariant.endsWith("munzee") && baseVariant.length > 6) {
        yield baseVariant.replace(/munzee$/g, "");
      }
    }
  }

  get(id: number | string): Type | undefined {
    if (typeof id === "string") {
      for (const variant of MetaClient.getStrippedVariants(id)) {
        const typeId = this._types.get(variant);
        if (typeId === undefined) continue;
        const type = this._typesRoot.get(typeId);
        if (type) return type;
      }
    }
    const typeId = this._types.get(id);
    if (typeId === undefined) return;
    return this._typesRoot.get(typeId);
  }

  getGroup(id: number | string): Group | undefined {
    const groupId = this._groups.get(id);
    if (groupId === undefined) return;
    return this._groupsRoot.get(groupId);
  }

  get types(): Type[] {
    return Array.from(this._typesRoot.values());
  }

  get groups(): Group[] {
    return Array.from(this._groupsRoot.values());
  }
}

export class TypeProperties {
  private _type: Type;

  constructor(type: Type) {
    this._type = type;
  }

  get isPassiveCapture(): boolean {
    return (
      this._type.hasTag(TypeTags.TypeSocial) ||
      this._type.hasTag(TypeTags.TypeUniversal) ||
      this._type.hasTag(TypeTags.TypePersonal)
    );
  }

  get isPassiveDeploy(): boolean {
    return (
      this._type.hasTag(TypeTags.Scatter) ||
      (this._type.hasTag(TypeTags.Evolution) && (this._type.meta.evolution?.stage ?? 0) > 1)
    );
  }

  get isBouncerBase(): boolean {
    return (
      this._type.hasTag(TypeTags.BouncerHost) ||
      this._type.hasTag(TypeTags.DestinationBouncer) ||
      this._type.hasTag(TypeTags.DestinationRooms)
    );
  }

  get isDestinationBase(): boolean {
    return this._type.hasTag(TypeTags.DestinationRooms);
  }

  get isDestinationRoom(): boolean {
    return this._type.hasTag(TypeTags.DestinationRoom);
  }
}
