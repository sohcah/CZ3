import {
  AutocompleteInteraction,
  CacheType,
  CommandInteraction,
  GuildMember,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  SelectMenuInteraction,
} from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";
import { ChatInputAction, ChatInputOptions } from "../action_types/chatinput.js";
import { SelectMenuAction } from "../action_types/select.js";
import { api } from "../trpc/api.js";

async function handler(
  interaction: CommandInteraction | SelectMenuInteraction,
  typeOption: string | null
) {
  if (!typeOption) {
    return interaction.reply(`Could not find type: ${typeOption}`);
  }
  const typeDetails = await api.query("type:details", {
    id: typeOption,
    username: (interaction.member as GuildMember).displayName ?? interaction.user.username,
  });
  if (!typeDetails) {
    return interaction.reply(`Could not find type: ${typeOption}`);
  }
  const embed = new MessageEmbed()
    .setTitle(typeDetails.name)
    .setColor("GREEN")
    .setURL(`https://max.cuppazee.app/db/type/${typeDetails.id}`)
    .addField("Groups", typeDetails.groups.map(i => i.name).join(", "))
    .setThumbnail(typeDetails.icon);
  if (typeDetails.captures !== null) {
    embed.addField(`Captures - ${typeDetails.username}`, typeDetails.captures.toString());
  }
  interaction.reply({
    embeds: [embed],
    components: [
      new MessageActionRow().addComponents(
        ...typeDetails.groups
          .slice(0, 5)
          .map(i =>
            new MessageButton()
              .setStyle(MessageButtonStyles.PRIMARY)
              .setLabel(`View All ${i.name}`)
              .setCustomId(`group__${i.id}__0`)
          )
      ),
    ],
  });
}

export class TypeChatInputAction extends ChatInputAction {
  name = "type";
  description = "Get details on a Munzee Type";
  options: ChatInputOptions = [
    {
      type: "STRING",
      name: "type",
      description: "Type",
      autocomplete: true,
      required: true,
    },
  ];
  async handler(interaction: CommandInteraction) {
    const typeOption = interaction.options.getString("type");
    return await handler(interaction, typeOption);
  }
  async autocompleteHandler(interaction: AutocompleteInteraction<CacheType>) {
    const currentInput = interaction.options.getFocused();
    if (!currentInput) {
      return await interaction.respond([]);
    }
    const suggestions = await api.query("type:suggest", {
      input: currentInput.toString(),
    });
    interaction.respond(suggestions.slice(0, 25));
  }
}

export class TypeSelectMenuAction extends SelectMenuAction {
  customId = "type";
  async handler(interaction: SelectMenuInteraction) {
    const typeOption = interaction.values[0];
    return await handler(interaction, typeOption);
  }
}
