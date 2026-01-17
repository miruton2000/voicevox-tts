import { createRequestor, withJson } from "./http.request";
import type { AudioQuery, GetSpeakersParams, PostAudioQueryFromPresetParams, PostAudioQueryParams, PostInitializeSpeakerParams, PostSynthesisParams, Preset, Speaker } from "./voicevox.types";

const asJson = <T>(res: Response) => res.json() as Promise<T>;

//#region API
export const createClient = (baseUrl: string) => {
  const requestor = createRequestor(baseUrl);

  return {
    postAudioQuery: (params: PostAudioQueryParams) => (
      requestor.post('/audio_query', params)()
      .then(asJson<AudioQuery>)
    ),

    postAudioQueryFromPreset: (params: PostAudioQueryFromPresetParams)=> (
      requestor.post('/audio_query_from_preset', params)()
      .then(asJson<AudioQuery>)
    ),

    postSynthesis: (params: PostSynthesisParams, body: AudioQuery) => (
      requestor.post('/synthesis', params)(withJson(body))
      .then(res => {
        if (res.body === null) {
          throw new Error('body is null');
        }
        
        return res.body;
      })
    ),

    postInitializeSpeaker: (params: PostInitializeSpeakerParams) => (
      requestor.post('/initialize_speaker', params)()
      .then(_ => {})
    ),

    getPresets: () => (
      requestor.get('/presets')()
      .then(asJson<Preset[]>)
    ),

    postAddPreset: (body: Preset) => (
      requestor.post('/add_preset')(withJson(body))
      .then(asJson<number>)
    ),

    postUpdatePreset: (body: Preset) => (
      requestor.post('/update_preset')(withJson(body))
      .then(asJson<number>)
    ),

    getSpeakers: (params: GetSpeakersParams) => (
      requestor.get('/speakers', params)()
      .then(asJson<Speaker[]>)
    )
  }
};

export type VoicevoxClient = ReturnType<typeof createClient>;

//#endregion
