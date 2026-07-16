import { LLMProvider } from '../../interfaces/LLMProvider.js';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

/**
 * Google Gemini LLM Provider
 * Priority 1 in the LLM provider cascade.
 * Uses native fetch — no SDK dependency.
 */
export class GeminiProvider extends LLMProvider {
  constructor(apiKey, model = 'gemini-2.5-flash') {
    super(apiKey, model);
  }

  get name() { return 'gemini'; }

  /** Convert OpenAI-style messages to Gemini format */
  _convertMessages(messages) {
    const systemParts = [];
    const contents = [];

    for (const msg of messages) {
      if (msg.role === 'system') {
        systemParts.push({ text: msg.content });
      } else {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        });
      }
    }

    return { systemParts, contents };
  }

  /** Convert function declarations to Gemini tool format */
  _convertTools(tools) {
    if (!tools?.length) return undefined;
    return [{
      functionDeclarations: tools.map(t => ({
        name: t.name,
        description: t.description,
        parameters: t.parameters,
      })),
    }];
  }

  async complete(messages, tools = []) {
    const { systemParts, contents } = this._convertMessages(messages);
    const geminiTools = this._convertTools(tools);

    const body = {
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 512,
        topP: 0.9,
      },
    };

    if (systemParts.length) {
      body.systemInstruction = { parts: systemParts };
    }
    if (geminiTools) {
      body.tools = geminiTools;
    }

    const res = await fetch(
      `${GEMINI_API_BASE}/models/${this.model}:generateContent?key=${this.apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini API error ${res.status}: ${err}`);
    }

    const data = await res.json();
    const candidate = data.candidates?.[0];
    const part = candidate?.content?.parts?.[0];

    // Tool call
    if (part?.functionCall) {
      return {
        text: null,
        toolCalls: [{
          name: part.functionCall.name,
          args: part.functionCall.args,
        }],
        usage: {
          input: data.usageMetadata?.promptTokenCount ?? 0,
          output: data.usageMetadata?.candidatesTokenCount ?? 0,
        },
      };
    }

    return {
      text: part?.text ?? '',
      toolCalls: [],
      usage: {
        input: data.usageMetadata?.promptTokenCount ?? 0,
        output: data.usageMetadata?.candidatesTokenCount ?? 0,
      },
    };
  }

  async *stream(messages) {
    const { systemParts, contents } = this._convertMessages(messages);

    const body = { contents, generationConfig: { temperature: 0.7, maxOutputTokens: 512 } };
    if (systemParts.length) body.systemInstruction = { parts: systemParts };

    const res = await fetch(
      `${GEMINI_API_BASE}/models/${this.model}:streamGenerateContent?alt=sse&key=${this.apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    );

    if (!res.ok) throw new Error(`Gemini stream error ${res.status}`);

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        try {
          const json = JSON.parse(line.slice(6));
          const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) yield text;
        } catch { /* ignore parse errors on SSE chunks */ }
      }
    }
  }

  async completeWithTools(toolResults, originalMessages) {
    // Append tool results and re-invoke
    const messages = [
      ...originalMessages,
      { role: 'user', content: `Tool results: ${JSON.stringify(toolResults)}` },
    ];
    return this.complete(messages);
  }
}
