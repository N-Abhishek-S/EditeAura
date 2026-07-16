/**
 * Memory Manager — Short-term + Semantic long-term memory.
 * Summarizes older turns to keep token usage bounded.
 */

const MAX_RAW_TURNS = 6; // Keep last 6 turns verbatim
const SUMMARIZE_AFTER = 10; // Summarize when > 10 turns

/**
 * Get formatted memory for prompt injection.
 * @param {object} session
 * @returns {string}
 */
export function getFormattedMemory(session) {
  const messages = session.messages ?? [];
  if (messages.length <= MAX_RAW_TURNS) return '';

  // Return the summary if it exists
  if (session.memorySummary) {
    return `Earlier conversation summary: ${session.memorySummary}`;
  }

  return '';
}

/**
 * Update memory — summarize old turns when threshold is reached.
 * Called after each assistant reply.
 * @param {object} session
 * @param {Function} llmComplete - LLM complete function for summarization
 */
export async function updateMemory(session, llmComplete) {
  const messages = session.messages ?? [];
  if (messages.length < SUMMARIZE_AFTER) return;

  // Only summarize if we don't have a fresh summary
  const lastSummarizedAt = session.lastSummarizedAt ?? 0;
  if (messages.length - lastSummarizedAt < 6) return; // Summarize every 6 new turns

  try {
    const toSummarize = messages.slice(0, messages.length - MAX_RAW_TURNS);
    const transcript = toSummarize
      .map(m => `${m.role === 'user' ? 'Client' : 'Aura'}: ${m.content}`)
      .join('\n');

    const result = await llmComplete([
      { role: 'system', content: 'Summarize this conversation excerpt in 2–3 concise sentences. Focus on: what the client wants, key facts mentioned (budget, timeline, company), and what was discussed. Plain text only.' },
      { role: 'user', content: transcript },
    ]);

    if (result.text) {
      session.memorySummary = result.text;
      session.lastSummarizedAt = messages.length;
    }
  } catch { /* Non-critical — continue without summary */ }
}

/**
 * Get token estimate for a message array.
 * Rough estimate: 4 chars ≈ 1 token.
 */
export function estimateTokens(messages) {
  return Math.ceil(
    messages.reduce((sum, m) => sum + (m.content?.length ?? 0), 0) / 4
  );
}
