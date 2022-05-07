import {
  ButtonInteraction,
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import { ButtonAction } from "../action_types/button.js";
import { api } from "../trpc/api.js";
import { ChatInputAction } from "../action_types/chatinput.js";
import Jwt from "jsonwebtoken";
import { config } from "../utils/config.js";

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
