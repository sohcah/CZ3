import { createReactQueryHooks } from "@trpc/react";
import type { AppRouter } from "@cz3/api/router";

export const trpc = createReactQueryHooks<AppRouter>();
