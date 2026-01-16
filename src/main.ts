import { initializeBot } from "./discord.bot";
import { getTtsOptions } from "./ttsOptions";
import { initializeEngine } from "./voicevox.engine";

const init = async () => {
  const options = getTtsOptions();
  const client = await initializeEngine(options);
  initializeBot(process.env.DISCORD_TOKEN, client, options);
};

init();
