import { CommandInteraction, MessageEmbed } from "discord.js";
import { ChatInputAction } from "../action_types/chatinput.js";

export class AboutChatInputAction extends ChatInputAction {
  name = "abuot";
  description = "Learn more about Rover";

  async handler(interaction: CommandInteraction) {
    const embed = new MessageEmbed()
      .setTitle(`Rover`)
      .setColor("GREEN")
      // .setURL(`https://cuppazee.app/rover`)
      .setThumbnail(interaction.client.user?.displayAvatarURL() ?? "")
      .setDescription(
        `Rover is a Discord bot developed by CuppaZee to allow for verification of Munzee accounts in the Munzee Discord server, as well as to provide access to Munzee data.\nThe bot is open-sourced under the Mozilla Public License 2.0, with source code available [on GitHub](https://github.com/CuppaZee/CZ3/tree/main/bot).`
      );
    await interaction.reply({
      embeds: [embed],
    });
  }
}
