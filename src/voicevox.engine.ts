import { spawn } from "node:child_process";
import waitOn from 'wait-on';
import { createRequestor } from "./http.request";
import { createVoicevoxApplication } from "./voicevox.application";
import { createVoicevoxEndpoint } from "./voicevox.endpoint";
import PRESET from './voicevox.preset.json' with { key: "json" };
import { Preset } from "./voicevox.types";

const startEngine = (port: number) => {
  const child = spawn(
    'voicevox-engine/run.exe',
    ['--port', String(port)],
    { stdio: 'inherit' }
  );

  process.once('exit', () => {
    if (!child.killed) { child.kill(); }
  });
  process.once('SIGINT', () => process.exit());
  process.once('SIGTERM', () => process.exit());

  return new Promise<string>((resolve, reject) => {
    child.once('exit', (code) => {
      reject(new Error(`Engine exited with code ${code} before starting.`));
    });

    waitOn({
      resources: [`http-get://localhost:${port}/version`],
      timeout: 30000,
      interval: 100,
    })
    .then(() => {
      child.removeAllListeners('exit');
      resolve(`http://localhost:${port}`);
    })
    .catch((err) => {
      child.kill();
      reject(err);
    });
  });
};

export const initializeEngine = async (port: number) => {
  const baseUrl = await startEngine(port);
  
  const application = createVoicevoxApplication(
    createVoicevoxEndpoint(
      createRequestor(baseUrl)
    )
  );

  await application.registerPreset(PRESET as Preset);
  await application.initializeSpeaker();

  return application;
};
