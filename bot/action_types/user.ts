import { UserContextMenuInteraction } from "discord.js";
import { ApplicationCommandTypes } from "discord.js/typings/enums.d.js";
import { CommandAction } from "./action.js";

export abstract class UserAction extends CommandAction<UserContextMenuInteraction> {
  getCommandConfig() {
    return {
      type: ApplicationCommandTypes.USER,
      name: this.name,
    } as const;
  }
}
