//#region Base
export type QueryParamValue = string | number | boolean | null | undefined;
export type HttpMethod = (
  'POST'  |
  'GET'   |
  'PUT'   |
  'DELETE'
);
export type HttpQueryParameters = Record<string, QueryParamValue> | undefined;
export type HttpBody = Record<string, any> | undefined;

export type HttpRequest<
  M extends HttpMethod,
  U extends string,
  P extends HttpQueryParameters,
  B extends HttpBody,
> = {
  method: M;
  url: U;
  parameters: P;
  body: B;
};

//#endregion

//#region Schemas
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

//#region Make a query
export type AudioQuery = HttpRequest<'POST', 'audio_query', {
  text: string;
  speaker: number;
  enable_katakana_english?: boolean;
  core_version?: string;
}, undefined>;

export type AudioQueryFromPreset = HttpRequest<'POST', 'audio_query_from_preset', {
  text: string;
  preset_id: number;
  enable_katakana_english?: boolean;
  core_version?: string;
}, undefined>;

//#endregion

//#region Synthesis
export type Synthesis = HttpRequest<'POST', 'synthesis', {
  speaker: number;
  enable_interrogative_upspeak?: boolean;
  core_version?: string;
}, Record<string, any>>;

//#endregion

//#region Others
export type InitializeSpeaker = HttpRequest<'POST', 'initialize_speaker', {
  speaker: number;
  skip_reinit?: boolean;
  core_version?: string;
}, undefined>;

export type Presets = HttpRequest<'GET', 'presets', undefined, undefined>;
export type AddPreset = HttpRequest<'POST', 'add_preset', undefined, Preset>;
export type UpdatePreset = HttpRequest<'POST', 'update_preset', undefined, Preset>;

//#endregion

//#region TTS Options
export type TtsOptions = {
  port: number;
  speaker: number;
  ownerId: string;
};
