import { VoiceProvider } from '../../interfaces/VoiceProvider.js';

/**
 * SpeechSynthesis API shim for development/fallback.
 * Returns null — client-side SpeechSynthesis handles playback on frontend.
 * This provider tells the gateway to send a text-only response;
 * the frontend reads it aloud using the browser's SpeechSynthesis.
 */
export class SynthesisProvider extends VoiceProvider {
  constructor() { super(null); }
  get name() { return 'synthesis'; }
  isAvailable() { return true; } // Always available

  async synthesize(text) {
    // Signal to gateway: use browser-side TTS
    return null;
  }

  async *stream(text) {
    // No stream — frontend handles speech
    yield null;
  }
}
