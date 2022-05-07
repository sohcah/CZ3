import fs from "node:fs";
import { z } from "zod";
import chalk from "chalk";

const fileContent = JSON.parse(
  fs.readFileSync(
    process.env.NODE_ENV === "development" ? "./config.json" : "/cuppazee.json",
    "utf8"
  )
);

export const configSchema = z.object({
  token: z.string(),
  apiUrl: z.string().url(),
  devGuild: z.string().optional(),
  exDevGuild: z.string().optional(),
  mainGuild: z.string(),
  jwtSecret: z.string(),
  rollbar: z
    .object({
      accessToken: z.string(),
      captureUncaught: z.boolean(),
      captureUnhandledRejections: z.boolean(),
    })
    .optional(),
  roles: z.object({
    mhq: z.string(),
    premium: z.string(),
    player: z.string(),
    unverified: z.string(),
  }),
});
export type Config = z.infer<typeof configSchema>;

const configData = configSchema.safeParse(fileContent);

if (!configData.success) {
  for (const error of configData.error.errors) {
    console.error(
      chalk`[{yellow.bold ${error.path
        .map(i => (typeof i === "string" ? `.${i}` : `[${i}]`))
        .join("")
        .replace(/^./g, "")}}] {redBright ${error.message}}`
    );
  }
  process.exit(1);
}

export const config = configData.data;
