import { CommandInteraction, EmbedBuilder, Colors } from "discord.js";
import { ChatInputAction } from "../action_types/chatinput.js";

export class AboutChatInputAction extends ChatInputAction {
  name = "about";
  description = "Learn more about Rover";

  async handler(interaction: CommandInteraction) {
    const embed = new EmbedBuilder()
      .setTitle(`Rover`)
      .setColor(Colors.Green)
      // .setURL(`https://cuppazee.app/rover`)
      .setThumbnail(interaction.client.user?.displayAvatarURL() ?? "")
      .setDescription(
        `Rover is a Discord bot developed by [CuppaZee](https://cuppazee.app) to allow for verification of Munzee accounts in the Munzee Discord server, as well as to provide access to Munzee data.\n\nThe bot is open-sourced under the Mozilla Public License 2.0, with source code available [on GitHub](https://github.com/CuppaZee/CZ3/tree/main/bot).`
      );
    await interaction.reply({
      embeds: [embed],
    });
  }
}
