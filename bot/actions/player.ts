import {
  CommandInteraction,
  GuildMember,
  MessageEmbed,
  User,
  UserContextMenuInteraction,
} from "discord.js";
import dayjs from "dayjs";
import { ChatInputAction, ChatInputOptions } from "../action_types/chatinput.js";
import { UserAction } from "../action_types/user.js";
import { api } from "../trpc/api.js";

type PlayerIdentifier =
  | {
      username: string;
    }
  | {
      userId: number;
    };

async function getPlayerIdForUser(user: User | GuildMember): Promise<PlayerIdentifier> {
  const userResult = await api.query("discord:user", {
    snowflake: user.id,
  });
  if (!userResult) {
    return {
      username: "displayName" in user ? user.displayName : user.username,
    };
  }
  return {
    userId: userResult,
  };
}

async function handler(
  interaction: CommandInteraction | UserContextMenuInteraction,
  playerId: PlayerIdentifier | null
) {
  if (!playerId) {
    return await interaction.reply({
      ephemeral: true,
      content: `You need to select a Player`
    });
  }

  const player = await api.query("player:profile", playerId);
  if (!player) {
    return await interaction.reply({
      ephemeral: true,
      content: `Could not find player: ${
        "userId" in playerId ? playerId.userId : playerId.username
      }`,
    });
  }
  const embed = new MessageEmbed()
    .setTitle(
      `${player.username}${player.titles.length > 0 ? ` - ` : ""}${player.titles.join(", ")}`
    )
    .setColor("GREEN")
    .setURL(`https://www.munzee.com/m/${player.username}`)
    .setThumbnail(player.avatar)
    .addField("Start Date", dayjs(player.start).format("DD/MM/YYYY HH:mm:ss"));
  if (player.clan) {
    embed.addField("Clan", `[${player.clan.name}](https://cuppazee.app/clan/${player.clan.id})`);
  }

  return interaction.reply({
    ephemeral: true,
    embeds: [embed],
  });
}

export class PlayerChatInputAction extends ChatInputAction {
  name = "player";
  description = "Get details on a Munzee player";
  options: ChatInputOptions = [
    {
      type: "STRING",
      name: "player",
      description: "Player",
      required: true,
    },
  ];

  async handler(interaction: CommandInteraction) {
    const playerOption = interaction.options.getString("player");
    return await handler(interaction, playerOption ? { username: playerOption } : null);
  }
}

export class PlayerUserAction extends UserAction {
  name = "Player Details";
  description = "Get details on a Munzee player";

  async handler(interaction: UserContextMenuInteraction) {
    const playerOption = interaction.options.getMember("user");
    if (playerOption instanceof GuildMember) {
      const playerId = await getPlayerIdForUser(playerOption);
      return await handler(interaction, playerId);
    }
    const userOption = interaction.options.getUser("user");
    const playerId = userOption ? await getPlayerIdForUser(userOption) : null;
    return await handler(interaction, playerId);
  }
}
