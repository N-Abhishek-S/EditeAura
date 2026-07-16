/**
 * Conversation Orchestrator — single coordination layer.
 * Every message flows through here. This is the heart of the system.
 */
import { classifyIntent, calculateGoalCompletion } from './intentEngine.js';
import { extractLeadFields, calculateLeadScore, getLeadPriority } from './leadExtractor.js';
import { buildPrompt } from './promptEngine.js';
import { getFormattedMemory, updateMemory } from './memoryManager.js';
import { evaluateHandoff } from './handoffEngine.js';
import { checkFAQCache } from './costOptimizer.js';
import { trackCosts, formatCostUpdate } from './costTracker.js';
import { selectAgent, getVoiceConfig } from './agentRouter.js';
import { logger } from './logger.js';

/** Provider instances — injected at startup from server.js */
let _llmProvider = null;
let _voiceProvider = null;

export function injectProviders({ llmProvider, voiceProvider }) {
  _llmProvider = llmProvider;
  _voiceProvider = voiceProvider;
}

/**
 * Process a single conversation turn.
 * @param {object} session - Session from sessionManager
 * @param {string} userMessage - Transcribed user text
 * @param {Function} send - WebSocket send function: (message: object) => void
 * @returns {Promise<void>}
 */
export async function processTurn(session, userMessage, send) {
  const startTime = Date.now();

  try {
    // ── 1. Cost optimizer: FAQ cache check ───────────────────────
    const cached = checkFAQCache(userMessage);
    if (cached.hit) {
      await streamReply(session, cached.response, send, startTime, 'cache');
      return;
    }

    // ── 2. Intent classification ─────────────────────────────────
    const intentResult = classifyIntent(userMessage, session.intent);
    session.intent = intentResult.intent;
    session.intentHistory = [...(session.intentHistory ?? []), intentResult.intent];

    send({ type: 'intent_update', intent: intentResult.intent, confidence: intentResult.confidence });

    // ── 3. Agent routing ─────────────────────────────────────────
    const agentId = selectAgent(session, intentResult.intent);
    if (agentId !== session.agentId) {
      session.agentId = agentId;
      session.persona = agentId;
      logger.info('agent_switched', { sessionId: session.id, agentId });
    }

    // ── 4. Handoff check ─────────────────────────────────────────
    const handoff = evaluateHandoff(userMessage, intentResult.confidence, session);
    if (handoff.trigger) {
      session._handoffReason = handoff.reason;
      session.metrics.handoffs++;
      send({ type: 'handoff_trigger', reason: handoff.reason, message: handoff.message });
      await streamReply(session, handoff.message, send, startTime, 'handoff');
      return;
    }

    // ── 5. Booking intent → visual panel ─────────────────────────
    if (intentResult.bookingRequired) {
      send({ type: 'booking_trigger' });
    }

    // ── 6. Continuous lead extraction ────────────────────────────
    const { updates, confidence, newFields } = extractLeadFields(
      userMessage, '', session.leadProfile
    );
    if (Object.keys(updates).length > 0) {
      Object.assign(session.leadProfile, updates);
      Object.assign(session.confidence, confidence);
      newFields.forEach(field => {
        send({ type: 'lead_update', field, value: updates[field], confidence: confidence[field] });
      });
    }

    // ── 7. Session goal completion ────────────────────────────────
    session.goalCompletionPct = calculateGoalCompletion(session.goalId, session.leadProfile);
    send({ type: 'goal_update', completionPct: session.goalCompletionPct });

    // ── 8. Memory retrieval ───────────────────────────────────────
    const memory = getFormattedMemory(session);

    // ── 9. Prompt construction ───────────────────────────────────
    const messages = buildPrompt({
      agentId,
      session,
      memory,
      ragDocs: [],   // RAG injected here when VITE_FF_RAG=true
      intent: intentResult.intent,
      intentConfidence: intentResult.confidence,
      leadProfile: session.leadProfile,
      userMessage,
    });

    // ── 10. LLM call ──────────────────────────────────────────────
    send({ type: 'thinking' });
    const llmStart = Date.now();
    const llmResult = await _llmProvider.complete(messages);
    const llmLatency = Date.now() - llmStart;

    const replyText = llmResult.text ?? '';
    if (!replyText) {
      send({ type: 'error', code: 'EMPTY_REPLY', message: 'Sorry, I had trouble forming a response. Could you rephrase that?' });
      return;
    }

    // ── 11. Track costs ───────────────────────────────────────────
    trackCosts(session, {
      inputTokens: llmResult.usage?.input ?? 0,
      outputTokens: llmResult.usage?.output ?? 0,
    });
    send(formatCostUpdate(session));

    // ── 12. Save messages ─────────────────────────────────────────
    session.messages.push({ role: 'user', content: userMessage, timestamp: Date.now() });
    session.messages.push({ role: 'assistant', content: replyText, timestamp: Date.now(), latencyMs: Date.now() - startTime });
    session.metrics.messageCount++;

    const totalLatency = Date.now() - startTime;
    if (!session.metrics.firstResponseMs) session.metrics.firstResponseMs = totalLatency;
    session.metrics.avgLatencyMs = Math.round(
      (session.metrics.avgLatencyMs * (session.metrics.messageCount - 1) + totalLatency) / session.metrics.messageCount
    );

    logger.llmCall({ sessionId: session.id, provider: _llmProvider.name, model: _llmProvider.model, latencyMs: llmLatency, inputTokens: llmResult.usage?.input, outputTokens: llmResult.usage?.output });

    // ── 13. Send text reply ───────────────────────────────────────
    send({ type: 'reply_text', text: replyText, intent: intentResult.intent, agentId });

    // ── 14. TTS ───────────────────────────────────────────────────
    const voiceConfig = getVoiceConfig(agentId);
    if (_voiceProvider.isAvailable()) {
      await streamAudio(session, replyText, voiceConfig, send);
    } else {
      // Frontend handles SpeechSynthesis
      send({ type: 'tts_fallback', text: replyText });
    }

    // ── 15. Update semantic memory (non-blocking) ─────────────────
    updateMemory(session, _llmProvider.complete.bind(_llmProvider)).catch(() => {});

  } catch (err) {
    logger.apiError({ event: 'orchestrator_error', sessionId: session.id, error: err.message, stack: err.stack });
    send({ type: 'error', code: 'ORCHESTRATOR_ERROR', message: 'Something went wrong. Please try again.' });
  }
}

async function streamReply(session, text, send, startTime, source) {
  session.messages.push({ role: 'assistant', content: text, timestamp: Date.now(), source });
  send({ type: 'reply_text', text });
  if (_voiceProvider?.isAvailable()) {
    await streamAudio(session, text, getVoiceConfig(session.agentId), send);
  } else {
    send({ type: 'tts_fallback', text });
  }
}

async function streamAudio(session, text, voiceConfig, send) {
  const ttsStart = Date.now();
  let charCount = 0;
  let chunkIndex = 0;

  try {
    for await (const chunk of _voiceProvider.stream(text, voiceConfig)) {
      if (!chunk) continue; // null = synthesis fallback
      charCount += text.length;
      send({ type: 'audio_chunk', data: chunk.toString('base64'), chunkIndex: chunkIndex++ });
    }
    send({ type: 'audio_done' });

    const ttsDuration = Date.now() - ttsStart;
    trackCosts(session, { ttsChars: charCount });
    logger.ttsStream({ sessionId: session.id, provider: _voiceProvider.name, characters: charCount, durationMs: ttsDuration, firstChunkMs: ttsStart });
  } catch (err) {
    logger.providerFail({ name: 'voice', error: err.message, sessionId: session.id });
    send({ type: 'tts_fallback', text });
  }
}
