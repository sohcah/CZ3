import {
  AutocompleteInteraction,
  CacheType,
  CommandInteraction,
  GuildMember,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  SelectMenuInteraction,
  Colors,
  ButtonStyle,
  ApplicationCommandOptionType,
} from "discord.js";
import { ChatInputAction, ChatInputOptions } from "../action_types/chatinput.js";
import { SelectMenuAction } from "../action_types/select.js";
import { api } from "../trpc/api.js";

async function handler(
  interaction: CommandInteraction | SelectMenuInteraction,
  typeOption: string | null
) {
  if (!typeOption) {
    await interaction.reply(`Could not find type: ${typeOption}`);
    return;
  }
  const typeDetails = await api.type.details.query({
    id: typeOption,
    username: (interaction.member as GuildMember).displayName ?? interaction.user.username,
  });
  if (!typeDetails) {
    await interaction.reply(`Could not find type: ${typeOption}`);
    return;
  }
  const embed = new EmbedBuilder()
    .setTitle(typeDetails.name)
    .setColor(Colors.Green)
    .setURL(`https://max.cuppazee.app/db/type/${typeDetails.id}`)
    .addFields({ name: "Groups", value: typeDetails.groups.map(i => i.name).join(", ") })
    .setThumbnail(typeDetails.icon);
  if (typeDetails.captures !== null) {
    embed.addFields({
      name: `Captures - ${typeDetails.username}`,
      value: typeDetails.captures.toString(),
    });
  }
  await interaction.reply({
    embeds: [embed],
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        ...typeDetails.groups
          .slice(0, 5)
          .map(i =>
            new ButtonBuilder()
              .setStyle(ButtonStyle.Primary)
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
      type: ApplicationCommandOptionType.String,
      name: "type",
      description: "Type",
      autocomplete: true,
      required: true,
    },
  ];

  async handler(interaction: CommandInteraction) {
    const typeOption = interaction.options.get("type")?.value as string | undefined;
    await handler(interaction, typeOption ?? null);
  }

  async autocompleteHandler(interaction: AutocompleteInteraction<CacheType>) {
    const currentInput = interaction.options.getFocused();
    if (!currentInput) {
      return await interaction.respond([]);
    }
    const suggestions = await api.type.suggest.query({
      input: currentInput.toString(),
    });
    await interaction.respond(suggestions.slice(0, 25));
  }
}

export class TypeSelectMenuAction extends SelectMenuAction {
  customId = "type";

  async handler(interaction: SelectMenuInteraction) {
    const typeOption = interaction.values[0];
    return await handler(interaction, typeOption);
  }
}
