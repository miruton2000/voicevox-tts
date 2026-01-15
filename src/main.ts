import { initializeBot } from "./bot";
import { initializeEngine } from "./engine";
import { TtsOptions } from "./types";

const getOptions = (): TtsOptions => ({
  port: Number(process.env.ENGINE_PORT ?? "50021"),
  speaker: Number(process.env.ENGINE_SPEAKER ?? "1"),
  ownerId: process.env.OWNER_ID ?? "",
});

const init = async () => {
  const options = getOptions();
  await initializeEngine(options);
  initializeBot(process.env.DISCORD_TOKEN, options);
};

init();
