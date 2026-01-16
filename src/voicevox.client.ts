import { createRequestor, withJson } from "./http.request";
import type { AudioQuery, PostAudioQueryFromPresetParams, PostAudioQueryParams, PostInitializeSpeakerParams, PostSynthesisParams, Preset } from "./voicevox.types";

//#region API
export const createClient = (baseUrl: string) => {
  const requester = createRequestor(baseUrl);

  return {
    postAudioQuery: (params: PostAudioQueryParams) => (
      requester.post('/audio_query', params)()
      .then(res => res.json() as Promise<AudioQuery>)
    ),

    postAudioQueryFromPreset: (params: PostAudioQueryFromPresetParams)=> (
      requester.post('/audio_query_from_preset', params)()
      .then(res => res.json() as Promise<AudioQuery>)
    ),

    postSynthesis: (params: PostSynthesisParams, body: AudioQuery) => (
      requester.post('/synthesis', params)(withJson(body))
      .then(res => {
        if (res.body === null) {
          throw new Error('body is null');
        }
        
        return res.body;
      })
    ),

    postInitializeSpeaker: (params: PostInitializeSpeakerParams) => (
      requester.post('/initialize_speaker', params)()
      .then(_ => {})
    ),

    getPresets: () => (
      requester.get('/presets')()
      .then(res => res.json() as Promise<Preset[]>)
    ),

    postAddPreset: (body: Preset) => (
      requester.post('/add_preset')(withJson(body))
      .then(res => res.json() as Promise<number>)
    ),

    postUpdatePreset: (body: Preset) => (
      requester.post('/update_preset')(withJson(body))
      .then(res => res.json() as Promise<number>)
    ),
  }
};

export type VoicevoxClient = ReturnType<typeof createClient>;

//#endregion
