import { VoicevoxEndpoint } from "./voicevox.endpoint";
import { Preset } from "./voicevox.types";

export const createVoicevoxApplication = (endpoint: VoicevoxEndpoint) => {
  const getPreset = async (preset_id: number = 0) => {
    const presets = await endpoint.getPresets();
    const preset = presets.find((preset) => preset.id === preset_id);
    
    if (preset === undefined) {
      throw new Error(`preset ${preset_id} not found.`);
    }

    return preset;
  };

  return {
    getPreset,

    speak: async (text: string, preset_id: number = 0) => {
      const preset = await getPreset(preset_id);
      
      const audioQuery = await endpoint.postAudioQueryFromPreset({
        text,
        preset_id: preset.id,
      });
      
      return endpoint.postSynthesis({
        speaker: preset.style_id
      }, audioQuery);
    },

    registerPreset: async (preset: Preset) => {
      const presets = await endpoint.getPresets();
      const api = (
        presets.some((p) => p.id === preset.id)
          ? endpoint.postUpdatePreset
          : endpoint.postAddPreset
      );

      return api(preset);
    },
    
    initializeSpeaker: async (preset_id: number = 0) => {
      const preset = await getPreset(preset_id);
      await endpoint.postInitializeSpeaker({ speaker: preset.style_id });
    },

    endpoint,
  }
};

export type VoicevoxApplication = ReturnType<typeof createVoicevoxApplication>;
