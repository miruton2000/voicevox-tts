import { initializeBot } from "./discord.bot";
import { initializeEngine } from "./voicevox.engine";

const init = async () => {
  const port = Number(process.env.ENGINE_PORT ?? '50021');
  const application = await initializeEngine(port);
  initializeBot(process.env.DISCORD_TOKEN, process.env.OWNER_ID, application);
};

init();
