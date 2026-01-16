//#region Parameter Schema
export type PostAudioQueryParams = {
  text: string;
  speaker: number;
  enable_katakana_english?: boolean;
  core_version?: string;
};

export type PostAudioQueryFromPresetParams = {
  text: string;
  preset_id: number;
  enable_katakana_english?: boolean;
  core_version?: string;
};

export type PostSynthesisParams = {
  speaker: number;
  enable_interrogative_upspeak?: boolean;
  core_version?: string;
};

export type PostInitializeSpeakerParams = {
  speaker: number;
  skip_reinit?: boolean;
  core_version?: string;
};

//#endregion

//#region Body Schema
export type AudioQuery = Record<string, any>;

export type Preset = {
  id: number;
  name: string;
  speaker_uuid: string;
  style_id: number;
  speedScale: number;
  pitchScale: number;
  intonationScale: number;
  volumeScale: number;
  prePhonemeLength: number;
  postPhonemeLength: number;
  pauseLength?: number;
  pauseLengthScale?: number;
};

//#endregion
