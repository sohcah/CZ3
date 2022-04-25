import { SelectMenuInteraction } from "discord.js";
import { InputAction } from "./action.js";

export abstract class SelectMenuAction extends InputAction<SelectMenuInteraction> {}
