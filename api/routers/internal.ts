import { meta } from "../utils/meta.js";
import { t } from "../trpc.js";
import { p } from "../utils/prisma.js";

export const internalRouter = t.router({
  missing: t.procedure.query(async () => {
    const missing = await p.missing_types.findMany();
    const missingTypes = missing.map(i => ({
      name: null as string | null,
      id: i.capture_type_id ? Number(i.capture_type_id) : null,
      icon: i.icon.startsWith("https://") ? i.icon.slice(49, -4) : i.icon,
      iconUrl: meta.getIcon(i.icon),
    }));
    return {
      types: missingTypes.filter(
        i => !meta.get(i.icon) || (i.id && meta.get(i.icon)?.munzeeId === undefined)
      ),
    };
  }),
});
