import { inferAsyncReturnType } from "@trpc/server";
import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

export enum CuppaZeeApplication {
  AppV3 = "AppV3",
  Other = "Other",
}

export function createContext({ req, res }: CreateFastifyContextOptions) {
  const app = (req.headers["x-cuppazee-application"] ?? "Other") as CuppaZeeApplication;

  return { req, res, app };
}

export type Context = inferAsyncReturnType<typeof createContext>;
