import { Group } from "./groups";

export enum TypeState {
  Physical = 0x01,
  Virtual = 0x02,
  Bouncer = 0x03,
  Locationless = 0x04,
}

export enum TypePointsType {
  Split = 0x01,
}

export interface TypePoints {
  deploy?: number;
  capture?: number;
  capon?: number;
  type?: TypePointsType;
  split?: number;
  min?: number;
  interval?: number;
}

export enum TypeHidden {
  All = 0x01,
  Inventory = 0x02,
  Bouncers = 0x03,
  Capture = 0x04,
  Deploy = 0x05,
}

export enum TypeTags {
  // Type Tags
  TypeEvent = 0x00,
  TypeEventCustom = 0x01,
  TypeEventStandard = 0x02,

  TypeWeapon = 0x03,
  TypeWeaponClan = 0x04,
  TypeWeaponZeeops = 0x05,

  TypeZodiac = 0x06,
  TypeZodiacWestern = 0x07,
  TypeZodiacChinese = 0x08,
  TypeZodiacEgyptian = 0x09,

  TypeMystery = 0x0a,
  TypeMysteryElemental = 0x0b,

  TypeReseller = 0x0c,
  TypeResellerRetired = 0x0d,

  TypePOI = 0x0e,
  TypeDestination = 0x0f,
  TypeGaming = 0x10,
  TypeJewel = 0x11,
  TypeFlat = 0x12,
  TypeTrail = 0x13,
  TypeTourism = 0x14,
  TypeSeasonal = 0x15,
  TypeUnique = 0x16,
  TypeVirtual = 0x17,

  TypePersonal = 0x18,
  TypeSocial = 0x19,
  TypeUniversal = 0x1a,

  // Bouncer Tags
  BouncerPC = 0x1b,
  BouncerPCS1 = 0x1c,
  BouncerPCS2 = 0x1d,
  BouncerPCEscaped = 0x1e,
  BouncerPCZombie = 0x1f,
  BouncerPCFunfinity = 0x20,
  BouncerPCGleaming = 0x21,
  BouncerPCStageless = 0x22,
  BouncerPCStage1 = 0x23,
  BouncerPCStage2 = 0x24,
  BouncerPCStage3 = 0x25,
  BouncerMyth = 0x26,
  BouncerMythOriginal = 0x27,
  BouncerMythClassical = 0x28,
  BouncerMythMirror = 0x29,
  BouncerMythModern = 0x2a,
  BouncerMythAlterna = 0x2b,
  BouncerMythVariant = 0x2c,
  BouncerRetired = 0x2d,
  BouncerFlat = 0x2e,
  BouncerFlatPhantom = 0x2f,
  BouncerEvolution = 0x30,
  BouncerTPOB = 0x31,
  BouncerTPOBBabyAnimal = 0x32,
  BouncerNomad = 0x33,
  BouncerSeasonal = 0x34,
  BouncerSeasonal2021 = 0x35,
  BouncerSeasonal2020 = 0x36,
  BouncerSeasonal2019 = 0x37,
  BouncerSeasonal2018 = 0x38,
  BouncerSeasonal2017 = 0x39,
  BouncerSeasonal2016 = 0x3a,
  BouncerSeasonal2015 = 0x3b,
  BouncerSeasonalLegacy = 0x3c,
  Bouncer = 0x3d,

  // Bouncer Host Tags
  BouncerHostPC = 0x3e,
  BouncerHostPCEscaped = 0x3f,
  BouncerHostPCZombie = 0x40,
  BouncerHostPCFunfinity = 0x41,
  BouncerHostPCGleaming = 0x42,
  BouncerHostPCStage1 = 0x43,
  BouncerHostPCStage2 = 0x44,
  BouncerHostPCStage3 = 0x45,
  BouncerHostMyth = 0x46,
  BouncerHostMythOriginal = 0x47,
  BouncerHostMythClassical = 0x48,
  BouncerHostMythMirror = 0x49,
  BouncerHostMythModern = 0x4a,
  BouncerHostMythAlterna = 0x4b,
  BouncerHostMythVariant = 0x4c,
  BouncerHostRetired = 0x4d,
  BouncerHostFlat = 0x4e,
  BouncerHostEvolution = 0x4f,
  BouncerHostTPOB = 0x50,
  BouncerHostTPOBBabyAnimal = 0x51,
  BouncerHostSeasonal = 0x52,
  BouncerHostSeasonal2021 = 0x53,
  BouncerHostSeasonal2020 = 0x54,
  BouncerHostSeasonal2019 = 0x55,
  BouncerHostSeasonal2018 = 0x56,
  BouncerHostSeasonal2017 = 0x57,
  BouncerHostSeasonalLegacy = 0x58,
  BouncerHost = 0x59,

  // Card Tags
  Card = 0x5a,
  CardOpen = 0x5b,
  Card2020 = 0x5c,
  Card2020HCCC = 0x5d,
  Card2021 = 0x5e,
  Card2021VCCC = 0x5f,
  Card2021BCCC = 0x77,

  // Evolution
  Evolution = 0x60,
  EvolutionFarm = 0x61,
  EvolutionEducation = 0x62,
  EvolutionNature = 0x63,
  EvolutionReseller = 0x64,
  EvolutionGeneric = 0x65,

  // Virtual Colours
  VirtualColourPink = 0x66,
  VirtualColourLouPink = 0x67,
  VirtualColourGreen = 0x68,
  VirtualColourRed = 0x69,
  VirtualColourBlue = 0x6a,
  VirtualColourBlack = 0x6b,
  VirtualColourBrown = 0x6c,

  // Scatter Tags
  Scatter = 0x6d,
  ScatterStandalone = 0x6e,

  // Destination Tags
  DestinationRooms = 0x73,
  DestinationRoom = 0x74,
  DestinationBouncer = 0x75,
  DestinationTemporary = 0x76,

  // Other Tags
  Credit = 0x6f,
  Other = 0x70,
  Redeemable = 0x78,

  // Function Tags
  FunctionSwap = 0x71,
  FunctionBlast = 0x72,
}
// Latest: Redeemable = 0x78,

export type TypeQuery = string | number | ((type: Type) => boolean);

export interface TypeMeta {
  capture_radius?: number;

  evolution_stage?: number;
  evolution_base?: string;

  destination_size?: number;
  destination_star_level?: number;
  destination_room_of?: string | number;
  destination_temporary?: boolean;

  bouncer_duration?: number;
  bouncer_lands_on?: TypeQuery[];
  bouncer_base?: string;

  host_types?: TypeQuery[];

  scatter_duration?: number;
  scatter_lands_on?: TypeQuery[];

  scatterer_types?: TypeQuery[];
  scatterer_min?: number;
  scatterer_max?: number;
  scatterer_radius?: number;
}

export interface TypePoints {
  deploy?: number;
  capture?: number;
  capon?: number;
  type?: TypePointsType;
  split?: number;
  min?: number;
  interval?: number;
}

export interface TypeOptions {
  name: string;
  icons?: string[];
  id?: string;
  munzee_id?: number;
  state?: TypeState;
  groups?: Group[];
  points?: TypePoints;
  tags?: TypeTags[];
  hidden?: TypeHidden[];
  meta?: TypeMeta;
}

export class Type {
  // Munzee Name
  private data_name: string;
  // Munzee Icons
  private data_icons: string[];
  // CuppaZee ID
  private data_id: string;
  // Munzee ID
  private data_munzee_id?: number;
  // State - `physical`/`virtual`/`bouncer`/`locationless`
  private data_state: TypeState;
  // Groups
  private data_groups: Set<Group>;
  // Points Data
  private data_points?: TypePoints;
  // Type Tags
  private data_tags: Set<TypeTags>;
  // Type Hidden
  private data_hidden: TypeHidden[];
  // Type Meta
  private data_meta: TypeMeta;

  constructor(name: string, munzee_id?: number);
  constructor(parameters: TypeOptions);
  constructor(parameters: TypeOptions | string, munzee_id?: number) {
    const options = typeof parameters === "string" ? { name: parameters, munzee_id } : parameters;
    this.data_name = options.name;
    this.data_icons = options.icons ?? [options.name.toLowerCase().replace(/\s+/g, "")];
    this.data_id = options.id ?? options.name.toLowerCase().replace(/\s/g, "_");
    this.data_munzee_id = options.munzee_id;
    this.data_state = options.state!;
    this.data_groups = new Set(options.groups ?? []);
    this.data_points = options.points;
    this.data_tags = new Set(options.tags ?? []);
    this.data_hidden = options.hidden ?? [];
    this.data_meta = options.meta ?? {};
    this.template();
  }

  get name(): string {
    return this.data_name;
  }

  get icons(): string[] {
    return this.data_icons;
  }

  get id(): string {
    return this.data_id;
  }

  get munzee_id(): number | undefined {
    return this.data_munzee_id;
  }

  get groups(): Group[] {
    return [...this.data_groups];
  }

  get state(): TypeState {
    return this.data_state;
  }

  get points(): TypePoints | undefined {
    return this.data_points;
  }

  get tags(): TypeTags[] {
    return [...this.data_tags];
  }

  get hidden(): TypeHidden[] {
    return this.data_hidden;
  }

  get meta(): TypeMeta {
    return this.data_meta;
  }

  setName(name: string): this {
    this.data_name = name;
    return this;
  }

  addIcons(...icons: (string | string[])[]): this {
    this.data_icons.push(...icons.flat());
    return this;
  }
  addIcon = this.addIcons;

  setIcons(...icons: (string | string[])[]): this {
    this.data_icons = icons.flat();
    return this;
  }
  setIcon = this.setIcons;

  setId(id: string): this {
    this.data_id = id;
    return this;
  }

  setMunzeeId(munzee_id: number | undefined): this {
    this.data_munzee_id = munzee_id;
    return this;
  }

  addGroups(...groups: (Group | Group[])[]): this {
    for (const group of groups.flat()) {
      this.data_groups.add(group);
    }
    return this;
  }
  addGroup = this.addGroups;

  setGroups(...groups: (Group | Group[])[]): this {
    this.data_groups = new Set(groups.flat());
    return this;
  }
  setGroup = this.setGroups;

  setState(state: TypeState): this {
    this.data_state = state;
    return this;
  }

  physical = () => this.setState(TypeState.Physical);
  virtual = () => this.setState(TypeState.Virtual);

  setPoints(points: TypePoints | undefined): this {
    this.data_points = points;
    return this;
  }

  removeTags(...tags: (TypeTags | TypeTags[])[]): this {
    for (const tag of tags.flat()) {
      this.data_tags.delete(tag);
    }
    return this;
  }

  addTags(...tags: (TypeTags | TypeTags[])[]): this {
    for (const tag of tags.flat()) {
      this.data_tags.add(tag);
    }
    return this;
  }
  addTag = this.addTags;

  setTags(...tags: (TypeTags | TypeTags[])[]): this {
    this.data_tags = new Set(tags.flat());
    return this;
  }
  setTag = this.setTags;

  setHidden(hidden: TypeHidden[]): this {
    this.data_hidden = hidden;
    return this;
  }

  setMeta(meta: TypeMeta): this {
    this.data_meta = meta;
    return this;
  }

  scattererDistance(distance: number): this {
    this.data_meta.scatterer_radius = distance;
    return this;
  }

  scattererScatters(...types: (Type | Type[])[]): this {
    this.meta.scatterer_types ??= [];
    this.meta.scatterer_types.push(...types.flat().map(i => i.id));
    return this;
  }

  template(): void {}

  toCZD(): string {
    const data = [`n${this.data_name}`];

    const icons = this.data_icons.join(".");
    if (icons !== this.data_name.toLowerCase().replace(/\s+/g, "")) data.push(`o${icons}`);

    if (this.data_id !== this.data_name.toLowerCase().replace(/\s/g, "_"))
      data.push(`i${this.data_id}`);

    if (this.data_munzee_id !== undefined) data.push(`z${this.data_munzee_id.toString(36)}`);

    if (this.data_state) data.push(`s${this.data_state.toString(36)}`);

    if (this.data_groups) data.push(`g${[...this.data_groups].map(i => i.id).join(".")}`);

    if (this.data_points) data.push(`p${JSON.stringify(this.data_points)}`);

    if (this.data_tags.size > 0)
      data.push(`t${[...this.data_tags].map(i => i.toString(36)).join(".")}`);

    if (this.data_hidden?.length > 0)
      data.push(`h${this.data_hidden.map(i => i.toString(36)).join(".")}`);

    if (Object.keys(this.data_meta).length > 0) data.push(`m${JSON.stringify(this.data_meta)}`);

    return data.join("|");
  }
}

export class ScatterType extends Type {
  override template(): this {
    super.template();
    return this.addTag(TypeTags.Scatter);
  }

  standalone() {
    return this.virtual().addTag(TypeTags.ScatterStandalone);
  }
}

export class TypeDatabase {
  private data: Type[];

  constructor() {
    this.data = [];
  }

  public add(...types: (Type[] | Type)[]): this {
    this.data.push(
      ...types.flat().map(i => {
        if (!i.name) throw new Error(`Type ${JSON.stringify(i)} must have a name`);
        if (!i.state) throw new Error(`Type ${i.name} must have a state`);
        return i;
      })
    );
    return this;
  }

  public get(id: string): Type | undefined {
    return this.data.find(type => type.id === id);
  }

  get types(): Type[] {
    return this.data;
  }
}

export class TypeSet extends Array<Type> {
  constructor(array?: Type[]) {
    super();
    if (array) this.push(...array);
  }

  public add(...types: (Type[] | Type)[]): this {
    this.push(...types.flat());
    return this;
  }

  each(callbackfn: (value: Type, index: number, array: Type[]) => Type, thisArg?: any): this {
    this.forEach(callbackfn, thisArg);
    return this;
  }
}
