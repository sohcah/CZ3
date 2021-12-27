import { GroupDatabase } from "./groups";
import { TypeDatabase } from "./types";

export class Database {
  types: TypeDatabase;
  groups: GroupDatabase;

  constructor() {
    this.types = new TypeDatabase();
    this.groups = new GroupDatabase();
  }

  toCZD(): string {
    return `-t\n${this.types.types.map(i => i.toCZD()).join("\n")}\n-g\n${this.groups.groups.map(i => i.name).join("\n")}`;
  }
}
