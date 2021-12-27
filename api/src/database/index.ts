import { Database } from "./database";
import glob from "glob";

export const database = new Database();

import { join } from "path";
import { Type, TypeSet } from "./types";
import { Group } from "./groups";

const path = join(__dirname, "./**/*/*.[tj]s");
const files = glob.sync(path);

(async function () {
  const promises = [];
  for (const file of files) {
    promises.push(import(file));
  }
  const items: (Type | Group | TypeSet)[] = (await Promise.all(promises))
    .map(i => Object.values(i))
    .flat<any>(1);
  for (const item of items) {
    if (item instanceof Type) {
      database.types.add(item);
    } else if (item instanceof TypeSet) {
      database.types.add(item);
    } else if (item instanceof Group) {
      database.groups.add(item);
    }
    // Ignore others
  }
  console.log(database.toCZD());
})();
