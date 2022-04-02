// import { CuppaZeeDB, loadFromLzwJson } from "@cuppazee/db";
import fetch from "node-fetch";
import { MetaClient, TypeData, GroupData } from "@cz3/meta-client";

export const dbCache: { value: MetaClient } = {
  // value: new CuppaZeeDB([], [], []),
  value: new MetaClient([], []),
};

export async function loadAgain() {
  console.info("DBLOADING");
  const response = await fetch(
    `https://github.com/CuppaZee/Meta/releases/download/beta/database.min.json`
  );
  if (!response.ok) throw "e";
  const data = (await response.json()) as { types: TypeData[]; groups: GroupData[] };
  // if (data.length > 0) {
  //   const { db } = loadFromLzwJson(data);
  //   dbCache.value = db;
  // }
  dbCache.value = new MetaClient(data.types, data.groups);
  console.info("DBLOAD:", dbCache.value.groups.length);
  if (!dbCache.value.groups.length) {
    await loadAgain();
  }
}

loadAgain();
