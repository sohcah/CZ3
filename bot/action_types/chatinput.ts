import {
  ApplicationCommandOptionData,
  ApplicationCommandType,
  AutocompleteInteraction,
  CommandInteraction,
} from "discord.js";
import { CommandAction } from "./action.js";

export type ChatInputOptions = ApplicationCommandOptionData[];

export abstract class ChatInputAction extends CommandAction<CommandInteraction> {
  public abstract description: string;
  options?: ChatInputOptions;
  defaultPermission?: boolean;

  getCommandConfig() {
    return {
      type: ApplicationCommandType.ChatInput,
      name: this.name,
      description: this.description,
      options: this.options,
      defaultPermission: this.defaultPermission,
    } as const;
  }

  autocompleteHandler(interaction: AutocompleteInteraction): Promise<void> {
    return Promise.resolve();
  }
}
