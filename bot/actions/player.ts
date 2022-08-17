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

async function handler(
  interaction: CommandInteraction | UserContextMenuInteraction,
  playerOption: string | User | GuildMember | null
) {
  if (!playerOption) {
    return await interaction.reply(`You need to select a Player`);
  }
  let usernameOrId: number | string | null;
  if (typeof playerOption === "string") {
    usernameOrId = playerOption;
  } else {
    usernameOrId =
      (await api.query("discord:user", {
        snowflake: playerOption.id,
      })) ?? ("displayName" in playerOption ? playerOption.displayName : playerOption.username);
  }

  const player = await api.query(
    "player:profile",
    typeof usernameOrId === "number"
      ? {
          userId: usernameOrId,
        }
      : {
          username: usernameOrId,
        }
  );
  if (!player) {
    return await interaction.reply(`Could not find player: ${playerOption}`);
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
    return await handler(interaction, playerOption);
  }
}

export class PlayerUserAction extends UserAction {
  name = "Player Details";
  description = "Get details on a Munzee player";

  async handler(interaction: UserContextMenuInteraction) {
    const playerOption = interaction.options.getMember("user");
    if (playerOption instanceof GuildMember) {
      return await handler(interaction, playerOption.user);
    }
    const userOption = interaction.options.getUser("user");
    if (userOption instanceof User) {
      return await handler(interaction, userOption);
    }
    return await handler(interaction, null);
  }
}
