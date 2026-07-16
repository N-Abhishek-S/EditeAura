import { sessionManager } from '../lib/core/sessionManager.js';
import { buildSummaryPrompt } from '../lib/core/promptEngine.js';
import { calculateLeadScore, getLeadPriority } from '../lib/core/leadExtractor.js';
import { jobQueue, registerHandler } from '../lib/core/jobQueue.js';
import { dispatchNotifications } from '../lib/core/notificationPipeline.js';
import { logger } from '../lib/core/logger.js';

// Register background job handlers
registerHandler('dispatch_notifications', dispatchNotifications);
registerHandler('generate_summary', generateAndStoreSummary);

/**
 * POST /api/voice/end
 * Ends a session, generates AI summary, scores lead, triggers notification pipeline.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { sessionId } = req.body ?? {};
  if (!sessionId) return res.status(400).json({ error: 'sessionId is required' });

  const session = sessionManager.get(sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found or expired' });

  try {
    sessionManager.end(sessionId);

    // Score the lead
    const score = calculateLeadScore(session.leadProfile);
    const priority = getLeadPriority(score);

    // Generate summary synchronously (user waits for this — it powers the modal)
    let summary = null;
    try {
      summary = await generateSummary(session);
    } catch (err) {
      logger.warn('summary_generation_failed', { sessionId, error: err.message });
      summary = buildFallbackSummary(session);
    }

    // Build transcript
    const transcript = session.messages
      .map(m => `${m.role === 'user' ? 'Client' : 'Aura'}: ${m.content}`)
      .join('\n');

    // Background: notifications, analytics, storage
    jobQueue.enqueue('dispatch_notifications', { session, summary, score, priority, transcript });

    logger.info('session_ended', {
      sessionId,
      score,
      priority,
      messageCount: session.metrics.messageCount,
      durationMs: Date.now() - session.createdAt,
      totalCostUsd: session.costs?.total?.toFixed(5),
    });

    return res.json({ success: true, summary, score, priority });

  } catch (err) {
    logger.apiError({ event: 'session_end_error', sessionId, error: err.message });
    return res.status(500).json({ error: 'Failed to end session' });
  }
}

async function generateSummary(session) {
  // Import LLM provider lazily to avoid circular deps
  const { GeminiProvider } = await import('../lib/providers/llm/GeminiProvider.js');
  const { ScriptedProvider } = await import('../lib/providers/llm/ScriptedProvider.js');

  const provider = process.env.GEMINI_API_KEY
    ? new GeminiProvider(process.env.GEMINI_API_KEY)
    : new ScriptedProvider();

  if (!session.messages.length) return buildFallbackSummary(session);

  const messages = buildSummaryPrompt(session);
  const result = await provider.complete(messages);

  if (!result.text) return buildFallbackSummary(session);

  try {
    // Strip markdown fences if present
    const cleaned = result.text.replace(/```json?|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return buildFallbackSummary(session);
  }
}

async function generateAndStoreSummary({ session, summary }) {
  // Placeholder for Supabase storage when configured
  logger.info('summary_stored', { sessionId: session.id });
}

function buildFallbackSummary(session) {
  const lead = session.leadProfile;
  return {
    clientName: lead.name ?? 'Unknown',
    company: lead.company ?? 'Unknown',
    requirements: lead.projectDescription ?? `Interested in: ${(lead.services ?? []).join(', ') || 'General enquiry'}`,
    painPoints: 'Not captured',
    budgetRange: lead.budget ?? 'Not mentioned',
    timeline: lead.timeline ?? 'Not mentioned',
    recommendedServices: lead.services ?? [],
    likelihood: 50,
    followUpActions: ['Follow up within 24 hours', 'Send service portfolio', 'Schedule strategy call'],
  };
}
