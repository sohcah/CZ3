import type { AppRouter } from "@cz3/api/router";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";

export const api = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "https://api.cuppazee.app/trpc",
      // url: "http://localhost/trpc",
    }),
  ],
  transformer: superjson,
});
