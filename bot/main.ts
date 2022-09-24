import dayjs from "dayjs";
import objectSupport from "dayjs/plugin/objectSupport.js";

dayjs.extend(objectSupport);

import { ChatInputAction } from "./action_types/chatinput.js";

import glob from "glob";
import {
  ActivityType,
  Client,
  IntentsBitField,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { config } from "./utils/config.js";
import { Action, ActionProps } from "./action_types/action.js";
import { UserAction } from "./action_types/user.js";
import { MessageAction } from "./action_types/message.js";
import { ButtonAction } from "./action_types/button.js";
import { SelectMenuAction } from "./action_types/select.js";

import "./server.js";
import { syncMember } from "./utils/syncMember.js";

export const client = new Client({
  allowedMentions: {
    users: [],
    parse: [],
    roles: [],
    repliedUser: false,
  },
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildMembers,
  ],
});

async function load() {
  const path = new URL("./actions/**/*.js", import.meta.url).pathname;
  const actionFiles = glob.sync(path);

  const actions = (
    await Promise.all(
      actionFiles
        .filter(file => file.endsWith(".js"))
        .map(async file => {
          let items;
          try {
            items = Object.values(await import(file));
          } catch (e) {
            console.error(e);
            process.exit(1);
          }
          const props: ActionProps = { client };
          const actions = items
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((item: any) => {
              if (
                item &&
                typeof item === "function" &&
                "prototype" in item &&
                "constructor" in item.prototype
              ) {
                return new item(props);
              }
              return null;
            })
            .filter(i => i !== null);
          console.info(
            `Loaded ${actions.length} actions from ${file.slice(file.indexOf("actions") + 8)}`
          );
          return (actions.filter(i => i && i instanceof Action) as Action<unknown>[]).filter(
            i => !i.disabled
          );
        })
    ).catch(e => {
      console.error(e);
      process.exit(1);
    })
  ).flat();

  const chatInputActions = actions.filter(i => i instanceof ChatInputAction) as ChatInputAction[];
  const userActions = actions.filter(i => i instanceof UserAction) as UserAction[];
  const messageActions = actions.filter(i => i instanceof MessageAction) as MessageAction[];
  const buttonActions = actions.filter(i => i instanceof ButtonAction) as ButtonAction[];
  const selectMenuActions = actions.filter(
    i => i instanceof SelectMenuAction
  ) as SelectMenuAction[];

  const commandActions = [...chatInputActions, ...userActions, ...messageActions];

  client.on("ready", () => {
    console.info("Ready!");
    client.application?.commands.set(commandActions.map(action => action.getCommandConfig()));
    if (config.devGuild) {
      client.guilds.resolve(config.devGuild)?.commands.set([
        ...commandActions.map(i => ({
          ...i.getCommandConfig(),
          name: (i instanceof ChatInputAction ? "dev__" : "DEV - ") + i.getCommandConfig().name,
        })),
      ]);
    } else if (config.exDevGuild) {
      client.guilds.resolve(config.exDevGuild)?.commands.set([]);
    }
    client.user?.setPresence({
      activities: [
        {
          name: ` | Bot by CuppaZee`,
          type: ActivityType.Watching,
        },
      ],
    });
  });

  client.on("interactionCreate", async interaction => {
    if (interaction.isCommand()) {
      const commandName = interaction.commandName.startsWith("dev__")
        ? interaction.commandName.slice(5)
        : interaction.commandName;
      const command = chatInputActions.find(i => i.name === commandName);
      if (!command) {
        await interaction.reply({ content: "Invalid Command", ephemeral: true });
        return;
      }
      try {
        await Promise.resolve(command.handler(interaction));
      } catch (e) {
        console.error(e);
        await interaction.reply({
          content: "⚠️ Oops! Something went wrong when running this command.",
          ephemeral: true,
        });
      }
    }

    if (interaction.isButton()) {
      const buttonAction = buttonActions.find(
        i => i.customId === interaction.customId.split("__")[0]
      );
      if (!buttonAction) {
        await interaction.reply({ content: "Invalid Button Action", ephemeral: true });
        return;
      }
      try {
        await Promise.resolve(buttonAction.handler(interaction));
      } catch (e) {
        console.error(e);
        await interaction.reply({
          content: "⚠️ Oops! Something went wrong when running this Button Action.",
          ephemeral: true,
        });
      }
    }

    if (interaction.isAutocomplete()) {
      const commandName = interaction.commandName.startsWith("dev__")
        ? interaction.commandName.slice(5)
        : interaction.commandName;
      const command = chatInputActions.find(i => i.name === commandName);
      if (!command?.autocompleteHandler) {
        return interaction.respond([]);
      }
      try {
        await Promise.resolve(command.autocompleteHandler(interaction));
      } catch (e) {
        console.error(e);
        await interaction.respond([]);
      }
    }

    if (interaction.isSelectMenu()) {
      const selectMenuAction = selectMenuActions.find(
        i => i.customId === interaction.customId.split("__")[0]
      );
      if (!selectMenuAction) {
        await interaction.reply({ content: "Invalid Select Menu Action", ephemeral: true });
        return;
      }
      try {
        await Promise.resolve(selectMenuAction.handler(interaction));
      } catch (e) {
        console.error(e);
        await interaction.reply({
          content: "⚠️ Oops! Something went wrong when running this Select Menu Action.",
          ephemeral: true,
        });
      }
    }

    if (interaction.isMessageContextMenuCommand()) {
      const commandName = interaction.commandName.startsWith("DEV - ")
        ? interaction.commandName.slice(6)
        : interaction.commandName;
      const messageAction = messageActions.find(i => i.name === commandName);
      if (!messageAction) {
        await interaction.reply({ content: "Invalid Message Action", ephemeral: true });
        return;
      }
      try {
        await Promise.resolve(
          messageAction.handler(interaction as MessageContextMenuCommandInteraction)
        );
      } catch (e) {
        console.error(e);
        await interaction.reply({
          content: "⚠️ Oops! Something went wrong when running this Message Action.",
          ephemeral: true,
        });
      }
    }

    if (interaction.isUserContextMenuCommand()) {
      const commandName = interaction.commandName.startsWith("DEV - ")
        ? interaction.commandName.slice(6)
        : interaction.commandName;
      const userAction = userActions.find(i => i.name === commandName);
      if (!userAction) {
        await interaction.reply({ content: "Invalid User Action", ephemeral: true });
        return;
      }
      try {
        await Promise.resolve(userAction.handler(interaction as UserContextMenuCommandInteraction));
      } catch (e) {
        console.error(e);
        await interaction.reply({
          content: "⚠️ Oops! Something went wrong when running this User Action.",
          ephemeral: true,
        });
      }
    }
  });

  client.on("guildMemberAdd", async member => {
    await syncMember(member);
  });

  await client.login(config.token);
}

load();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
process.on("unhandledRejection", (reason: any, _promise: Promise<any>) => {
  console.error("Unhandled Rejection at:", reason?.stack || reason);
});
