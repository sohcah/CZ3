import { createTRPCClient } from "@trpc/client";
import { config } from "../utils/config.js";
import type { AppRouter } from "@cz3/api/router.js";
import superjson from "superjson";
import fetch from "node-fetch";
export const api = createTRPCClient<AppRouter>({
  url: config.apiUrl,
  transformer: superjson,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetch: fetch as any,
});
