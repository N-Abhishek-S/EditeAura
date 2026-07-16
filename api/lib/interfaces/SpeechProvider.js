/**
 * SpeechProvider Interface
 * All STT implementations must conform to this contract.
 * Swap Deepgram → AssemblyAI → Google → Azure with zero application-layer changes.
 */
export class SpeechProvider {
  /** @param {string} apiKey */
  constructor(apiKey) {
    if (new.target === SpeechProvider) {
      throw new Error('SpeechProvider is abstract — use a concrete implementation.');
    }
    this.apiKey = apiKey;
    this.active = false;
  }

  /**
   * Start streaming transcription from a PCM audio stream.
   * @param {NodeJS.ReadableStream} audioStream
   * @returns {Promise<void>}
   */
  async start(audioStream) { throw new Error('Not implemented'); }

  /** Stop transcription. @returns {Promise<void>} */
  async stop() { throw new Error('Not implemented'); }

  /**
   * Register callback for transcript events.
   * @param {(event: {text: string, isFinal: boolean, confidence: number}) => void} cb
   */
  onTranscript(cb) { this._onTranscript = cb; }

  /** @param {(err: Error) => void} cb */
  onError(cb) { this._onError = cb; }

  /** @param {() => void} cb */
  onClose(cb) { this._onClose = cb; }

  /** @returns {string} Provider name for logging */
  get name() { return 'SpeechProvider'; }

  /** @returns {boolean} */
  isAvailable() { return !!this.apiKey; }
}
