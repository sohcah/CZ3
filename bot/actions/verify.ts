import {
  ButtonInteraction,
  CommandInteraction,
  GuildMember,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import { ButtonAction } from "../action_types/button.js";
import { api } from "../trpc/api.js";
import { ChatInputAction } from "../action_types/chatinput.js";
import Jwt from "jsonwebtoken";
import { config } from "../utils/config.js";
import { syncMember } from "../utils/syncMember.js";

async function handle(interaction: CommandInteraction | ButtonInteraction) {
  const token = Jwt.sign(
    {
      user_id: interaction.user.id,
      created_at: Date.now(),
    },
    config.jwtSecret
  );
  const verifyUrl = await api.query("discord:get_verify_url", {
    token,
  });
  const userId = await api.query("discord:user", {
    snowflake: interaction.user.id,
  });
  const player = userId
    ? await api.query("player:profile", {
        userId,
      })
    : undefined;
  if (player) {
    await syncMember(interaction.member as GuildMember);
    const embed = new MessageEmbed()
      .setTitle(`Verified as ${player.username}`)
      .setThumbnail(player.avatar)
      .setDescription(`Your Discord account is linked to the ${player.username} Munzee account.`)
      .setColor("#00ff00");
    await interaction.reply({
      embeds: [embed],
      components: [
        new MessageActionRow().addComponents(
          new MessageButton().setLabel("Switch Account").setStyle("LINK").setURL(verifyUrl)
        ),
      ],
      ephemeral: true,
    });
    return;
  }
  const embed = new MessageEmbed()
    .setTitle("Verify your account")
    .setDescription(
      `Please click the button below to link your Munzee Account to access all channels.`
    )
    .setColor("#00ff00");
  await interaction.reply({
    embeds: [embed],
    components: [
      new MessageActionRow().addComponents(
        new MessageButton().setLabel("Verify").setStyle("LINK").setURL(verifyUrl)
      ),
    ],
    ephemeral: true,
  });
}

export class VerifyButtonAction extends ButtonAction {
  customId = "verify";

  async handler(interaction: ButtonInteraction) {
    await handle(interaction);
  }
}

export class VerifyChatInputAction extends ChatInputAction {
  name = "verify";
  description = "Verify your account";

  async handler(interaction: CommandInteraction) {
    await handle(interaction);
  }
}

export class ForceVerifyChatInputAction extends ChatInputAction {
  name = "forceverify";
  description = "Force verify an account";

  options = [
    {
      type: "USER" as const,
      name: "discorduser",
      description: "Discord Username",
      required: true,
    },
    {
      type: "STRING" as const,
      name: "username",
      description: "Munzee Username",
      required: true,
    },
  ];

  async handler(interaction: CommandInteraction) {
    if (interaction.guild?.id !== config.mainGuild) {
      await interaction.reply("This command is only available in the main server.");
      return;
    }

    const member = interaction.options.getMember("discorduser");
    if (!member || !(member instanceof GuildMember)) {
      await interaction.reply("Please provide a valid Discord username.");
      return;
    }
    const username = interaction.options.getString("username");
    if (!username) {
      await interaction.reply("Please provide a valid Munzee username.");
      return;
    }

    const user = await api.query("player:profile", {
      username,
    });
    if (!user) {
      await interaction.reply("Please provide a valid Munzee username.");
      return;
    }

    await api.mutation("discord:link", {
      apiKey: config.apiKey,
      userId: user.id,
      snowflake: member.id,
    });

    await interaction.reply(`Verified ${member.displayName} as ${user.username}`);
    await syncMember(member as GuildMember);
    return;
  }
}
