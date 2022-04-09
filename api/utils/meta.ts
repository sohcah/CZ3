import fetch from "node-fetch";
import { MetaClient, TypeData, GroupData } from "@cz3/meta-client";

export const meta = new MetaClient([], []);

export async function loadAgain() {
  console.info("[MetaClient] Loading...");
  const response = await fetch(
    `https://github.com/CuppaZee/Meta/releases/download/beta/database.min.json`
  );
  if (!response.ok) throw "[MetaClient] Failed to load database";
  const data = (await response.json()) as { types: TypeData[]; groups: GroupData[] };
  meta.loadData(data.types, data.groups);
  console.info(`[MetaClient] Loaded ${meta.groups.length} groups`);
  if (!meta.groups.length) {
    await loadAgain();
  }
}

loadAgain();
