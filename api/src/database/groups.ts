export interface GroupOptions {
  name: string;
}

export class Group {
  static latestId = 0;
  static nextId() { return this.latestId++ }
  id: number = null!;
  name: string;
  parents: Group[] = [];

  constructor(options: GroupOptions) {
    this.name = options.name;
    this.id = Group.nextId();
  }
}

export class GroupDatabase {
  private data: Group[];

  constructor() {
    this.data = [];
  }

  public add(...groups: (Group[] | Group)[]): this {
    this.data.push(...groups.flat());
    return this;
  }

  public get(id: number): Group | undefined {
    return this.data.find(group => group.id === id);
  }

  get groups(): Group[] {
    return this.data;
  }
}
