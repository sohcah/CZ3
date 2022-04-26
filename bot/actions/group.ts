import { ButtonInteraction, MessageActionRow, MessageEmbed, MessageSelectMenu } from "discord.js";
import { ButtonAction } from "../action_types/button.js";
import { api } from "../trpc/api.js";

export class GroupButtonAction extends ButtonAction {
  customId = "group";
  async handler(interaction: ButtonInteraction) {
    const groupId = interaction.customId.split("__")[1];
    const groupDetails = await api.query("type:group", {
      id: groupId,
    });
    if (!groupDetails) {
      return interaction.reply(`Could not find group: ${groupId}`);
    }
    const embed = new MessageEmbed()
      .setTitle(groupDetails.name)
      .setColor("GREEN")
      .setURL(`https://max.cuppazee.app/db/${groupDetails.id}`)
      .addField("Types", groupDetails.types.length.toString())
      .setThumbnail(groupDetails.icon);
    interaction.reply({
      embeds: [embed],
      components: [
        new MessageActionRow().addComponents(
          new MessageSelectMenu().setCustomId("type").addOptions(
            groupDetails.types.map(i => ({
              label: i.name,
              value: i.id,
            }))
          )
        ),
      ],
    });
  }
}
