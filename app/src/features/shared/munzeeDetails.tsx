import { useEffect } from "react";
import { trpc } from "@/common/trpc/trpc";

export function MunzeeDetailsPanel({ munzeeId }: { munzeeId: number }) {
  const data = trpc.useQuery(["munzee:details", { munzeeId }]);
  return null;
}
