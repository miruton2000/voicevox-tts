import { createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel, StreamType } from "@discordjs/voice";
import { Client, GatewayIntentBits, Message } from "discord.js";
import { Readable } from "stream";
import { TtsOptions } from "./ttsOptions";
import { VoicevoxClient } from "./voicevox.client";

const player = createAudioPlayer();

// VOICEVOXで音声を生成する関数
const generateVoice = async (text: string, voicevox: VoicevoxClient, preset_id: number, options: TtsOptions) => {
  const audioQuery = await voicevox.postAudioQueryFromPreset({
    text,
    preset_id,
  });

  const wav = await voicevox.postSynthesis(
    { speaker: options.speaker },
    audioQuery,
  );

  // WebのReadableStreamをNode.jsのReadableに変換
  return createAudioResource(
    Readable.fromWeb(wav as any),
    { inputType: StreamType.Arbitrary },
  );
};

export const initializeBot = (token: string | undefined, voicevox: VoicevoxClient, options: TtsOptions) => {
  if (token === undefined) {
    throw new Error('token undefined.');
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
        if (message.author.id !== options.ownerId) {
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
        if (message.author.id !== options.ownerId) {
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
        message.author.id === options.ownerId &&
        message.content &&
        !message.content.startsWith('!')
      ) {
        const resource = await generateVoice(message.content, voicevox, 0, options);
        if (resource) {
          player.play(resource);
        }
      }
    }
  );

  client.login(token);

  return client;
};
