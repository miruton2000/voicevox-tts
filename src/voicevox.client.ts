import type { HttpQueryParams } from "./http.types";
import type { AudioQuery, PostAudioQueryFromPresetParams, PostAudioQueryParams, PostInitializeSpeakerParams, PostSynthesisParams, Preset } from "./voicevox.types";

const buildParameters = (params: HttpQueryParams | null): string => {
  if (params === null) {
    return "";
  }

  const validEntries = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => [key, String(value)]);

  if (validEntries.length === 0) {
    return "";
  }

  return '?' + new URLSearchParams(validEntries);
};

const requestBase = (baseUrl: string) => (
  (path: string, params: HttpQueryParams | null, init: RequestInit) => (
    fetch(
      [baseUrl, path, buildParameters(params)].join(''),
      init,
    )
    .then((response) => {
      if (!response.ok) {
        throw response;
      }

      return response;
    })
  )
);

//#region API
export const createClient = (baseUrl: string) => {
  const requestBaseUrlMounted = requestBase(baseUrl);

  return {
    postAudioQuery: (params: PostAudioQueryParams) => (
      requestBaseUrlMounted('/audio_query', params, { method: 'POST' })
      .then(res => res.json() as Promise<AudioQuery>)
    ),

    postAudioQueryFromPreset: (params: PostAudioQueryFromPresetParams)=> (
      requestBaseUrlMounted('/audio_query_from_preset', params, { method: 'POST' })
      .then(res => res.json() as Promise<AudioQuery>)
    ),

    postSynthesis: (params: PostSynthesisParams, body: AudioQuery) => (
      requestBaseUrlMounted('/synthesis', params, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      .then(res => {
        if (res.body === null) {
          throw new Error('body is null');
        }
        
        return res.body;
      })
    ),

    postInitializeSpeaker: (params: PostInitializeSpeakerParams) => (
      requestBaseUrlMounted('/initialize_speaker', params, { method: 'POST' })
      .then(_ => {})
    ),

    getPresets: () => (
      requestBaseUrlMounted('/presets', null, { method: 'GET' })
      .then(res => res.json() as Promise<Preset[]>)
    ),

    postAddPreset: (body: Preset) => (
      requestBaseUrlMounted('/add_preset', null, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      .then(res => res.json() as Promise<number>)
    ),

    postUpdatePreset: (body: Preset) => (
      requestBaseUrlMounted('/update_preset', null, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      .then(res => res.json() as Promise<number>)
    ),
  }
};

export type VoicevoxClient = ReturnType<typeof createClient>;

//#endregion
