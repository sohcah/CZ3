import { z } from "zod";
import { authenticatedUser, authenticateWithCuppaZeeToken } from "../utils/auth/index.js";
import { p } from "../utils/prisma.js";
import { config } from "../utils/config.js";
import { t } from "../trpc.js";

export const discordRouter = t.router({
  get_verify_url: t.procedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .query(async ({ input: { token } }) => {
      return `${config.apiUrl}/auth/login/discord?state=${JSON.stringify({
        app: "bot",
        platform: "discord",
        redirect: `${config.botUrl}/verify?discord_token=${encodeURIComponent(token)}`,
      })}`;
    }),
  link: t.procedure
    .input(
      z
        .object({
          cuppazeeToken: z.string(),
          snowflake: z.string(),
        })
        .or(
          z.object({
            apiKey: z.string(),
            userId: z.number(),
            snowflake: z.string(),
          })
        )
    )
    .mutation(async ({ input: { snowflake, ...input } }) => {
      let userId;
      if ("cuppazeeToken" in input) {
        const token = await authenticateWithCuppaZeeToken(input.cuppazeeToken);
        userId = await authenticatedUser(token);
      } else if ("userId" in input && input.apiKey === config.botApiKey) {
        userId = input.userId;
      } else {
        throw new Error("Invalid input");
      }
      await p.player_discord.upsert({
        where: {
          discord_snowflake: snowflake,
        },
        create: {
          user_id: userId,
          discord_snowflake: snowflake,
        },
        update: {
          user_id: userId,
        },
      });
    }),
  user: t.procedure
    .input(
      z.object({
        snowflake: z.string(),
      })
    )
    .query(async ({ input: { snowflake } }) => {
      const user = await p.player_discord.findUnique({
        where: {
          discord_snowflake: snowflake,
        },
      });
      if (!user) {
        return null;
      }
      return user.user_id;
    }),
});
