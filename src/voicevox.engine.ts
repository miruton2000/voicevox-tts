import { ChildProcess, spawn } from "node:child_process";
import waitOn from 'wait-on';
import { TtsOptions } from "./ttsOptions";
import { createVoicevoxEndpoint } from "./voicevox.client";
import PRESET from './voicevox.preset.json' with { key: "json" };
import { Preset } from "./voicevox.types";

const preset = PRESET as Preset;

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

  return new Promise<ChildProcess>((resolve, reject) => {
    child.once('exit', (code) => {
      reject(new Error(`Engine exited with code ${code} before starting.`));
    });

    waitOn({
      resources: [`http-get://localhost:${port}/docs`],
      timeout: 30000,
      interval: 100,
    })
    .then(() => {
      child.removeAllListeners('exit');
      resolve(child);
    })
    .catch((err) => {
      child.kill();
      reject(err);
    });
  });
};

export const initializeEngine = async (options: TtsOptions) => {
  await startEngine(options.port);
  
  const endpoint = createVoicevoxEndpoint(`http://localhost:${options.port}`);

  // Preset 取得
  const presets = await endpoint.getPresets();

  // Preset 設定
  if (presets.some((p) => p.id === preset.id)) {
    await endpoint.postUpdatePreset(preset);
  }
  else {
    await endpoint.postAddPreset(preset);
  }

  // Speaker 初期化
  await endpoint.postInitializeSpeaker({
    speaker: options.speaker,
  });

  return endpoint;
};
