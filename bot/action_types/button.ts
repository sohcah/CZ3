import { ButtonInteraction } from "discord.js";
import { InputAction } from "./action.js";

export abstract class ButtonAction extends InputAction<ButtonInteraction> {}
