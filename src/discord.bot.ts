import { createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel, StreamType } from "@discordjs/voice";
import { Client, GatewayIntentBits, Message } from "discord.js";
import { Readable } from "stream";
import { VoicevoxApplication } from "./voicevox.application";

const player = createAudioPlayer();

export const initializeBot = (token: string | undefined, ownerId: string | undefined, voicevox: VoicevoxApplication) => {
  if (token === undefined) {
    throw new Error('token undefined.');
  }

  if (ownerId === undefined) {
    throw new Error('ownerId undefined.');
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildVoiceStates,
    ],
  });

  client.on('messageCreate',
    async (message: Message) => {
      if (message.author.bot) {
        return;
      }

      // !join コマンドでボイスチャンネルに参加
      if (message.content === '!join') {
        const member = message.member;
        if (message.author.id !== ownerId) {
          return message.reply('オーナー以外の言うことは聞きません');
        }

        if (!member?.voice.channel) {
          return message.reply('先にボイスチャンネルに入ってね！');
        }

        const connection = joinVoiceChannel({
          channelId: member.voice.channel.id,
          guildId: message.guildId!,
          adapterCreator: message.guild!.voiceAdapterCreator,
        });

        connection.subscribe(player);
        return message.reply('ずんだもん、参上なのだ！');
      }

      if (message.content === '!leave') {
        if (message.author.id !== ownerId) {
          return message.reply('オーナー以外の言うことは聞きません');
        }
        
        const connection = getVoiceConnection(message.guildId!);
        connection?.destroy();
        return message.reply('さらばなのだ！');
      }

      // それ以外のメッセージは読み上げる（接続中のみ）
      const botVoiceChannel = message.guild!.members.me!.voice;
      if (
        message.channelId === botVoiceChannel.channelId &&
        message.author.id === ownerId &&
        message.content &&
        !message.content.startsWith('!')
      ) {
        const wav = await voicevox.speak(message.content);
        const resource = createAudioResource(
          Readable.fromWeb(wav as any),
          { inputType: StreamType.Arbitrary },
        );

        if (resource) {
          player.play(resource);
        }
      }
    }
  );

  client.login(token);

  return client;
};
