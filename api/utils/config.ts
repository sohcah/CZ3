import fs from "node:fs";
import { z } from "zod";
import chalk from "chalk";

const fileContent = JSON.parse(
  fs.readFileSync(
    process.env.NODE_ENV === "development" ? "./config.json" : "/cuppazee.json",
    "utf8"
  )
);

export const apiApplicationSchema = z.object({
  client_id: z.string(),
  client_secret: z.string(),
  redirect_uri: z.string(),
  id: z.string(),
  title: z.string(),
  discord: z.string().optional(),
  variant: z.number().optional(),
});
export type APIApplication = z.infer<typeof apiApplicationSchema>;

export const configSchema = z.object({
  apiUrl: z.string(),
  botUrl: z.string(),
  mongoURI: z.string(),
  mongoDB: z.string(),
  jwtSecret: z.string(),
  applications: z.record(apiApplicationSchema),
  discord: z.object({
    all_auth: z.string().optional(),
    missing_data: z.object({
      endpoint: z.string(),
      prefix: z.string(),
    }),
  }),
  rollbar: z
    .object({
      accessToken: z.string(),
      captureUncaught: z.boolean(),
      captureUnhandledRejections: z.boolean(),
    })
    .optional(),
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
