import { TypeTags } from "@cz3/meta-client";
import fetch from "node-fetch";
import { config } from "./config.js";
import { meta } from "./meta.js";
import { prisma } from "./prisma.js";

class KnownMissing {
  private types = new Set<string>();
  missingType(icon: string, capture_type_id: number | string | null = null): boolean {
    if (this.types.has(`${icon}-${capture_type_id}`)) return false;
    const type = meta.get(icon);
    if (!type) return true;
    if (capture_type_id !== null) {
      if (type.hasTag(TypeTags.Evolution)) return false;
      if (type.munzeeId !== Number(capture_type_id)) return true;
    }
    return false;
  }
  async ensureType(
    icon: string,
    capture_type_id: number | string | null = null,
    metadata: unknown = {}
  ) {
    if (this.missingType(icon, capture_type_id)) {
      if (!this.types.has(`${icon}-${capture_type_id}`)) {
        this.types.add(`${icon}-${capture_type_id}`);
        const existing = await prisma.missing_types.findFirst({
          where: {
            icon: icon,
            capture_type_id: capture_type_id === null ? undefined : Number(capture_type_id),
          },
        });
        if (!existing) {
          await prisma.missing_types.upsert({
            where: {
              icon: icon,
            },
            create: {
              icon: icon,
              capture_type_id: capture_type_id === null ? null : Number(capture_type_id),
            },
            update: {
              icon: icon,
              capture_type_id: capture_type_id === null ? null : Number(capture_type_id),
            },
          });
          const messageContent = `Missing type: ${icon} (${capture_type_id ?? "?"})
\`\`\`json
${JSON.stringify(metadata, null, 2)}
\`\`\``;
          await fetch(config.discord.missing_data.endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: config.discord.missing_data.prefix + messageContent,
            }),
          });
        }
      }
    }
  }

  async toJSON(): Promise<unknown> {
    return {
      types: [...this.types],
    };
  }
}

export const knownMissing = new KnownMissing();
