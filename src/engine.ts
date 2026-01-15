import { ChildProcess, spawn } from "node:child_process";
import waitOn from 'wait-on';
import PRESET from './preset.json' with { key: "json" };
import { request } from "./request";
import { AddPreset, InitializeSpeaker, Preset, Presets, TtsOptions, UpdatePreset } from "./types";

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
  
  const portMounted = request(options.port);

  // Preset 取得
  const reqPresets: Presets = {
    method: 'GET',
    url: 'presets',
    parameters: undefined,
    body: undefined,
  };

  const resPresets = await portMounted(reqPresets);
  const presets = await resPresets.json() as Preset[];

  // Preset 設定
  if (presets.some((p) => p.id === preset.id)) {
    const req: UpdatePreset = {
      method: 'POST',
      url: 'update_preset',
      parameters: undefined,
      body: preset
    };
    portMounted(req);
  }
  else {
    const req: AddPreset = {
      method: 'POST',
      url: 'add_preset',
      parameters: undefined,
      body: preset
    };
    portMounted(req);
  }

  // Speaker 初期化
  const reqInisializeSpeaker: InitializeSpeaker = {
    method: 'POST',
    url: 'initialize_speaker',
    parameters: {
      speaker: options.speaker,
    },
    body: undefined,
  };
  portMounted(reqInisializeSpeaker);
};
