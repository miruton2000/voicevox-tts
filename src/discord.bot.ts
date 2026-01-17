import { createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel, StreamType } from "@discordjs/voice";
import { Client, Events, GatewayIntentBits } from "discord.js";
import { Readable } from "stream";
import { initializeSlashCommands, SlashCommandTable } from "./discord.commands";
import { loadBotOptions } from "./discord.options";
import { VoicevoxApplication } from "./voicevox.application";

export const initializeBot = async (voicevox: VoicevoxApplication) => {
  const options = loadBotOptions();
  const player = createAudioPlayer();
  const commands: SlashCommandTable = {
    'join': {
      description: 'ボイスチャンネルに参加（または移動）するのだ！',
      action: (interaction) => {
        const guildMember = interaction.guild?.members.cache.get(interaction.user.id);
        const voiceChannelId = guildMember?.voice.channelId;

        if (!voiceChannelId) {
          interaction.reply('先にボイスチャンネルに入ってほしいのだ！');
          return;
        }

        // 別のサーバーで接続したままになっているかもしれないのですべて抜けておく
        const connections = interaction.client.guilds.cache;
        connections.forEach((guild) => {
          const connection = getVoiceConnection(guild.id);
          if (connection) {
            connection.destroy();
          }
        });

        const connection = joinVoiceChannel({
          channelId     : voiceChannelId,
          guildId       : interaction.guildId!,
          adapterCreator: interaction.guild!.voiceAdapterCreator,
        });

        connection.subscribe(player);
        interaction.reply('ずんだもん、参上なのだ！');
      }
    },

    'leave': {
      description: 'ボイスチャンネルからおさらばなのだ！',
      action: (interaction) => {
        const connection = getVoiceConnection(interaction.guildId!);
        connection?.destroy();
        interaction.reply('さらばなのだ！');
      }
    },
  };

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildVoiceStates,
    ],
  });

  // スラッシュコマンド処理
  const interactionCreateHandler = await initializeSlashCommands(commands, options);
  client.on(Events.InteractionCreate, interactionCreateHandler);
  
  // 読み上げ
  client.on(Events.MessageCreate, async (message) => {
    const botVoiceChannelId = message.guild?.members.me?.voice?.channelId;

    if (
      !message.content || // messageの内容がない
      !botVoiceChannelId || // bot が voice channel に参加していない
      message.channelId !== botVoiceChannelId || // voice channel 付属の text channel ではない
      message.author.id !== options.ownerId // オーナーの発言ではない
    ) {
      return;
    }

    const wav = await voicevox.speak(message.content);
    const resource = createAudioResource(
      Readable.fromWeb(wav as any),
      { inputType: StreamType.Arbitrary },
    );

    player.play(resource);
  });

  client.login(options.token);

  return client;
};
