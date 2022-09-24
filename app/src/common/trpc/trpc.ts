import { createTRPCReact } from "@trpc/react/dist/index.js";
import type { AppRouter } from "@cz3/api/router";

export const trpc = createTRPCReact<AppRouter>();
