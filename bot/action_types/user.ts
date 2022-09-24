import { ApplicationCommandType, UserContextMenuCommandInteraction } from "discord.js";
import { CommandAction } from "./action.js";

export abstract class UserAction extends CommandAction<UserContextMenuCommandInteraction> {
  getCommandConfig() {
    return {
      type: ApplicationCommandType.User,
      name: this.name,
    } as const;
  }
}
