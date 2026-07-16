/**
 * LLMProvider Interface
 * All LLM implementations must conform to this contract.
 * Swap Gemini → GPT → Claude → OpenRouter with zero application-layer changes.
 */
export class LLMProvider {
  constructor(apiKey, model) {
    if (new.target === LLMProvider) throw new Error('LLMProvider is abstract.');
    this.apiKey = apiKey;
    this.model = model;
  }

  /**
   * Non-streaming completion.
   * @param {Array<{role: string, content: string}>} messages
   * @param {Array<object>} [tools] - Function/tool declarations
   * @returns {Promise<{text: string, toolCalls?: Array, usage: {input: number, output: number}}>}
   */
  async complete(messages, tools = []) { throw new Error('Not implemented'); }

  /**
   * Streaming completion — yields text chunks.
   * @param {Array<{role: string, content: string}>} messages
   * @returns {AsyncGenerator<string>}
   */
  async *stream(messages) { throw new Error('Not implemented'); }

  /**
   * Complete after tool execution results are injected.
   * @param {Array} toolResults
   * @param {Array} originalMessages
   * @returns {Promise<{text: string, usage: object}>}
   */
  async completeWithTools(toolResults, originalMessages) { throw new Error('Not implemented'); }

  get name() { return 'LLMProvider'; }
  isAvailable() { return !!this.apiKey; }
}
