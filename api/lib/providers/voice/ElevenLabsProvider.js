import { VoiceProvider } from '../../interfaces/VoiceProvider.js';

/**
 * ElevenLabs Streaming TTS Provider
 * Priority 1 in the voice provider cascade.
 * Uses eleven_turbo_v2_5 for minimum latency.
 */
export class ElevenLabsProvider extends VoiceProvider {
  constructor(apiKey) {
    super(apiKey);
    this.baseUrl = 'https://api.elevenlabs.io/v1';
  }

  get name() { return 'elevenlabs'; }

  _buildConfig(config = {}) {
    return {
      model_id: 'eleven_turbo_v2_5',
      voice_settings: {
        stability: config.stability ?? 0.62,
        similarity_boost: config.similarityBoost ?? 0.82,
        style: config.style ?? 0.15,
        use_speaker_boost: true,
      },
      optimize_streaming_latency: 3,
      output_format: 'mp3_22050_32',
    };
  }

  async synthesize(text, config = {}) {
    const voiceId = config.voiceId ?? process.env.ELEVENLABS_VOICE_ID_CONSULTANT;
    if (!voiceId) throw new Error('ELEVENLABS_VOICE_ID is not configured.');

    const res = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': this.apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({ text, ...this._buildConfig(config) }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`ElevenLabs error ${res.status}: ${err}`);
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    return buffer;
  }

  async *stream(text, config = {}) {
    const voiceId = config.voiceId ?? process.env.ELEVENLABS_VOICE_ID_CONSULTANT;
    if (!voiceId) throw new Error('ELEVENLABS_VOICE_ID is not configured.');

    const res = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}/stream`, {
      method: 'POST',
      headers: {
        'xi-api-key': this.apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({ text, ...this._buildConfig(config) }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`ElevenLabs stream error ${res.status}: ${err}`);
    }

    const reader = res.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value?.length) yield Buffer.from(value);
    }
  }
}
