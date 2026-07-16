import { randomUUID } from 'crypto';
import { sessionManager } from '../lib/core/sessionManager.js';
import { logger } from '../lib/core/logger.js';

const INITIAL_GREETING = "Hello! I'm Aura, Edit Aura's AI Business Consultant. I can help you understand our services, estimate project costs, or schedule a strategy call. What can I help you with today?";

/**
 * POST /api/voice/session
 * Creates or resumes a session. Returns sessionId, flags, and initial greeting.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { userAgent, deviceType, timezone, referrer, language, resumeSessionId } = req.body ?? {};

    // Resume existing session
    if (resumeSessionId) {
      const existing = sessionManager.get(resumeSessionId);
      if (existing && existing.status === 'active') {
        return res.json({
          sessionId: existing.id,
          resumed: true,
          messageCount: existing.messages.length,
          featureFlags: getFeatureFlags(),
        });
      }
    }

    // Create new session
    const session = sessionManager.create({ userAgent, deviceType, timezone, referrer, language });

    logger.info('session_started', {
      sessionId: session.id,
      ip: req.ip,
      device: deviceType,
      language,
    });

    return res.json({
      sessionId: session.id,
      resumed: false,
      greeting: INITIAL_GREETING,
      featureFlags: getFeatureFlags(),
      voiceConfig: {
        useBrowserTTS: !process.env.ELEVENLABS_API_KEY,
        useWebSpeech: !process.env.DEEPGRAM_API_KEY,
      },
    });
  } catch (err) {
    logger.apiError({ event: 'session_create_error', error: err.message });
    return res.status(500).json({ error: 'Failed to create session' });
  }
}

function getFeatureFlags() {
  return {
    voice: process.env.VITE_FF_VOICE !== 'false',
    transcript: process.env.VITE_FF_TRANSCRIPT !== 'false',
    llm: process.env.VITE_FF_LLM !== 'false',
    booking: process.env.VITE_FF_BOOKING !== 'false',
    analytics: process.env.VITE_FF_ANALYTICS !== 'false',
    email: process.env.VITE_FF_EMAIL !== 'false',
    rag: process.env.VITE_FF_RAG === 'true',
    handoff: process.env.VITE_FF_HANDOFF !== 'false',
    admin: process.env.VITE_FF_ADMIN === 'true',
    costDisplay: process.env.VITE_FF_COST_DISPLAY === 'true',
  };
}
