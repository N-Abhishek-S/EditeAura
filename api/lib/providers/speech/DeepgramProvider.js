import { SpeechProvider } from '../../interfaces/SpeechProvider.js';
import { createClient } from '@deepgram/sdk';

/**
 * Deepgram Live Streaming STT Provider
 * Priority 1 in the speech provider cascade.
 * Requires DEEPGRAM_API_KEY.
 */
export class DeepgramProvider extends SpeechProvider {
  constructor(apiKey) {
    super(apiKey);
    this._connection = null;
  }

  get name() { return 'deepgram'; }

  async start(audioStream) {
    if (!this.apiKey) throw new Error('DEEPGRAM_API_KEY is not set.');

    const deepgram = createClient(this.apiKey);

    this._connection = deepgram.listen.live({
      model: 'nova-2',
      language: 'en-IN',        // English (India) — better for Indian accents
      smart_format: true,
      punctuate: true,
      interim_results: true,
      utterance_end_ms: 1000,   // Emit final after 1s silence
      vad_events: true,
    });

    this._connection.on('Results', (data) => {
      const alt = data.channel?.alternatives?.[0];
      if (!alt) return;
      const text = alt.transcript?.trim();
      if (!text) return;

      this._onTranscript?.({
        text,
        isFinal: data.is_final,
        confidence: alt.confidence ?? 0,
        words: alt.words ?? [],
      });
    });

    this._connection.on('error', (err) => {
      this._onError?.(err);
    });

    this._connection.on('close', () => {
      this.active = false;
      this._onClose?.();
    });

    // Pipe audio stream to Deepgram
    if (audioStream) {
      audioStream.on('data', (chunk) => {
        if (this._connection?.getReadyState() === 1) {
          this._connection.send(chunk);
        }
      });
    }

    this.active = true;
  }

  async stop() {
    if (this._connection) {
      this._connection.requestClose();
      this._connection = null;
    }
    this.active = false;
  }
}
