import { initializeBot } from "./discord.bot";
import { initializeEngine } from "./voicevox.engine";

const init = async () => {
  const port = Number(process.env.VOICEVOX_ENGINE_PORT ?? '50021');
  const application = await initializeEngine(port);
  await initializeBot(application);
};

init();
