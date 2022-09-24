import { GuildMember } from "discord.js";
import { api } from "../trpc/api.js";
import { config } from "./config.js";

export async function syncMember(member: GuildMember) {
  const userId = await api.discord.user.query({
    snowflake: member.user.id,
  });
  const player = userId
    ? await api.player.profile.query({
        userId,
      })
    : undefined;
  const roles = member.roles.cache
    .filter(i => !Object.values(config.roles).includes(i.id))
    .map(i => i.id);
  if (!player) {
    await member.roles.set([...roles, config.roles.unverified]);
    return;
  }
  roles.push(config.roles.player);
  if (player.premium) roles.push(config.roles.premium);
  if (player.mhq) roles.push(config.roles.mhq);

  await member.roles.set(roles);
}
