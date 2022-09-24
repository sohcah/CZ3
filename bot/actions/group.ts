import {
  ButtonInteraction,
  ActionRowBuilder,
  EmbedBuilder,
  SelectMenuBuilder,
  Colors,
} from "discord.js";
import { ButtonAction } from "../action_types/button.js";
import { api } from "../trpc/api.js";

export class GroupButtonAction extends ButtonAction {
  customId = "group";

  async handler(interaction: ButtonInteraction) {
    const groupId = interaction.customId.split("__")[1];
    const groupDetails = await api.type.group.query({
      id: groupId,
    });
    if (!groupDetails) {
      await interaction.reply(`Could not find group: ${groupId}`);
      return;
    }
    const embed = new EmbedBuilder()
      .setTitle(groupDetails.name)
      .setColor(Colors.Green)
      .setURL(`https://max.cuppazee.app/db/${groupDetails.id}`)
      .addFields({ name: "Types", value: groupDetails.types.length.toString() })
      .setThumbnail(groupDetails.icon);
    await interaction.reply({
      embeds: [embed],
      components: [
        new ActionRowBuilder<SelectMenuBuilder>().addComponents(
          new SelectMenuBuilder().setCustomId("type").addOptions(
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
