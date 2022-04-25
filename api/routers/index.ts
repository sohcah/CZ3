import trpc from "@trpc/server";
import { Context } from "../context.js";
import superjson from "superjson";

export function createRouter() {
  return trpc.router<Context>().transformer(superjson);
}
