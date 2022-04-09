import trpc from "@trpc/server";
import { Context } from "../context.js";

export function createRouter() {
  return trpc.router<Context>();
}
