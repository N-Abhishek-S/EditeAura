/**
 * VoiceProvider Interface
 * All TTS implementations must conform to this contract.
 * Swap ElevenLabs → Cartesia → SpeechSynthesis with zero application-layer changes.
 */
export class VoiceProvider {
  constructor(apiKey) {
    if (new.target === VoiceProvider) throw new Error('VoiceProvider is abstract.');
    this.apiKey = apiKey;
  }

  /**
   * Synthesize text to audio buffer.
   * @param {string} text
   * @param {object} config - { voiceId, stability, similarityBoost, style, languageCode }
   * @returns {Promise<Buffer>} MP3 audio buffer
   */
  async synthesize(text, config = {}) { throw new Error('Not implemented'); }

  /**
   * Stream synthesized audio chunks.
   * @param {string} text
   * @param {object} config
   * @returns {AsyncGenerator<Buffer>} MP3 chunk stream
   */
  async *stream(text, config = {}) { throw new Error('Not implemented'); }

  get name() { return 'VoiceProvider'; }
  isAvailable() { return !!this.apiKey; }
}
