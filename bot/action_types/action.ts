import { ApplicationCommandDataResolvable, Client } from "discord.js";

export interface ActionProps {
  client: Client;
}

export abstract class Action<T> {
  client: Client;
  constructor({ client }: ActionProps) {
    this.client = client;
  }
  public disabled = false;
  public abstract handler(interaction: T): Promise<void>;
}

export abstract class CommandAction<T> extends Action<T> {
  public abstract name: string;
  public abstract getCommandConfig(): ApplicationCommandDataResolvable;
}

export abstract class InputAction<T> extends Action<T> {
  public abstract customId: string;
}
