import { initializeBot } from "./discord.bot";
import { TtsOptions } from "./types";
import { initializeEngine } from "./voicevox.engine";

const getOptions = (): TtsOptions => ({
  port: Number(process.env.ENGINE_PORT ?? "50021"),
  speaker: Number(process.env.ENGINE_SPEAKER ?? "1"),
  ownerId: process.env.OWNER_ID ?? "",
});

const init = async () => {
  const options = getOptions();
  const client = await initializeEngine(options);
  initializeBot(process.env.DISCORD_TOKEN, client, options);
};

init();
