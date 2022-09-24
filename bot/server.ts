import { default as Fastify } from "fastify";
import { client } from "./main.js";
import Jwt from "jsonwebtoken";
import { config } from "./utils/config.js";
import { api } from "./trpc/api.js";
import { syncMember } from "./utils/syncMember.js";

const fastify = Fastify({
  maxParamLength: 1000,
  logger: {
    level: process.env.NODE_ENV === "development" ? "debug" : "warn",
  },
});

fastify.get<{
  Querystring: {
    code: string;
    discord_token: string;
  };
}>("/verify", async (request, reply) => {
  const { code, discord_token } = request.query;
  if (!code || !discord_token) {
    reply.code(400).send("Missing code or discord_token");
    return;
  }

  const discordTokenValue = Jwt.verify(discord_token, config.jwtSecret);
  const discordToken: any =
    typeof discordTokenValue === "string" ? JSON.parse(discordTokenValue) : discordTokenValue;

  const discordMember = (await client.guilds
    .resolve(config.mainGuild)!
    .members.fetch(discordToken.user_id))!;

  const user = await api.player.profile.query({
    cuppazeeToken: code,
  });

  await api.discord.link.mutate({
    cuppazeeToken: code,
    snowflake: discordMember.id,
  });

  await syncMember(discordMember);

  reply.type("html").send(`
  <!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<div class="bg-gray-50 dark:bg-gray-800 min-h-[100vh] flex flex-col justify-center items-center">
  <div class="flex flex-row justify-center items-center mb-4">
    <img class="h-16 w-16 rounded-full" src="${user!.avatar}" />
    <h1 aria-hidden="true" class="text-4xl text-black dark:text-white font-bold text-center tracking-[-0.3em] pr-[0.8em] pl-[0.5em]">
      ←→
    </h1>
    <img class="h-16 w-16 rounded-full" src="${discordMember.displayAvatarURL()}" />
  </div>
  <h1 class="text-3xl text-black dark:text-white font-bold text-center">
    Munzee Account Linked
  </h1>
  <h2 class="text-xl text-black dark:text-white font-bold text-center">
    You can now close this tab and return to Discord.
  </h2>
</body>
</html>
  `);
});

const start = async () => {
  try {
    await fastify.listen({ port: 81, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
await start();
