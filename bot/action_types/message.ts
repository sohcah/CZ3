import { ApplicationCommandType, MessageContextMenuCommandInteraction } from "discord.js";
import { CommandAction } from "./action.js";

export abstract class MessageAction extends CommandAction<MessageContextMenuCommandInteraction> {
  getCommandConfig() {
    return {
      type: ApplicationCommandType.Message,
      name: this.name,
    } as const;
  }
}
