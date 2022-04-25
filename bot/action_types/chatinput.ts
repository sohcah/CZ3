import { ApplicationCommandOptionData, CommandInteraction } from "discord.js";
import { ApplicationCommandTypes } from "discord.js/typings/enums.d.js";
import { CommandAction } from "./action.js";

export type ChatInputOptions = ApplicationCommandOptionData[];

export abstract class ChatInputAction extends CommandAction<CommandInteraction> {
  public abstract description: string;
  options?: ChatInputOptions;
  defaultPermission?: boolean;
  getCommandConfig() {
    return {
      type: ApplicationCommandTypes.CHAT_INPUT,
      name: this.name,
      description: this.description,
      options: this.options,
      defaultPermission: this.defaultPermission,
    } as const;
  }
}
