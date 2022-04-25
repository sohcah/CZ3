import { MessageContextMenuInteraction } from "discord.js";
import { ApplicationCommandTypes } from "discord.js/typings/enums.d.js";
import { CommandAction } from "./action.js";

export abstract class MessageAction extends CommandAction<MessageContextMenuInteraction> {
  getCommandConfig() {
    return {
      type: ApplicationCommandTypes.MESSAGE,
      name: this.name,
    } as const;
  }
}
