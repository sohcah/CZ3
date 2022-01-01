import { CuppaZeeDB, loadFromLzwJson } from "@cuppazee/db";
import fetch from "node-fetch";

export const dbCache: { value: CuppaZeeDB } = {
  value: new CuppaZeeDB([], [], []),
};

export async function loadAgain() {
  console.log("DBLOADING");
  const response = await fetch(`https://db.cuppazee.app/lzw/`);
  if (!response.ok) throw "e";
  const data = await response.text();
  if (data.length > 0) {
    const { db } = loadFromLzwJson(data);
    dbCache.value = db;
  }
  console.log("DBLOAD:", dbCache.value.categories.length);
  if (!dbCache.value.categories.length) {
    await loadAgain();
  }
}

loadAgain();