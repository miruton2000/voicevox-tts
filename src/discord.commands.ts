import { CacheType, ChatInputCommandInteraction, Interaction, REST, Routes } from "discord.js";
import { BotOptions } from "./discord.options";

type SlashCommandElem = {
  description: string;
  action: (interaction: ChatInputCommandInteraction<CacheType>) => void;  
};

export type SlashCommandTable = Record<string, SlashCommandElem>;

export const initializeSlashCommands = async (commands: SlashCommandTable, options: BotOptions) => {
  // スラッシュコマンドを登録
  await new REST({ version: '10' })
  .setToken(options.token)
  .put(
    Routes.applicationCommands(options.applicationId),
    { body: Object.entries(commands).map(
      ([name, { description }]) => ({ name, description })
    )}
  );

  // スラッシュコマンドの動作
  return async (interaction: Interaction<CacheType>) => {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    if (interaction.user.id !== options.ownerId) {
      interaction.reply('オーナー以外の言うことは聞きませんなのだ！');
      return;
    }

    commands[interaction.commandName]?.action(interaction);
  };
};
