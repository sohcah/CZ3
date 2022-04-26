import { AutocompleteInteraction, CacheType, CommandInteraction } from "discord.js";
import { ChatInputAction, ChatInputOptions } from "../action_types/chatinput.js";

export class TypeChatInputAction extends ChatInputAction {
  name = "player";
  description = "Get details on a Munzee player";
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
    const playerOption = interaction.options.getString("type");
    interaction.reply(`You typed ${playerOption}`);
  }
  async autocompleteHandler(interaction: AutocompleteInteraction<CacheType>) {
    interaction.respond([
      {
        name: "Greenie",
        value: "greenie",
      }
    ])
  };
}
