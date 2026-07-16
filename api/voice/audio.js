import { sessionManager } from '../lib/core/sessionManager.js';
import { ElevenLabsProvider } from '../lib/providers/voice/ElevenLabsProvider.js';
import { getVoiceConfig } from '../lib/core/agentRouter.js';
import { logger } from '../lib/core/logger.js';
import sanitizeHtml from 'sanitize-html';

/**
 * POST /api/voice/audio
 * ElevenLabs TTS proxy — streams audio back to browser.
 * API key never exposed to frontend.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { sessionId, text, language } = req.body ?? {};

  if (!sessionId || !text) {
    return res.status(400).json({ error: 'sessionId and text are required' });
  }

  const session = sessionManager.get(sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  // Sanitize text before sending to TTS
  const safeText = sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} })
    .slice(0, 2000); // Cap at 2000 chars

  if (!process.env.ELEVENLABS_API_KEY) {
    // Signal frontend to use SpeechSynthesis
    return res.json({ useFallback: true, text: safeText });
  }

  const ttsStart = Date.now();
  try {
    const provider = new ElevenLabsProvider(process.env.ELEVENLABS_API_KEY);
    const voiceConfig = { ...getVoiceConfig(session.agentId ?? 'business_consultant'), language };

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');

    for await (const chunk of provider.stream(safeText, voiceConfig)) {
      if (!res.writableEnded) res.write(chunk);
    }

    logger.ttsStream({
      sessionId, provider: 'elevenlabs',
      characters: safeText.length,
      durationMs: Date.now() - ttsStart,
    });

    res.end();
  } catch (err) {
    logger.providerFail({ name: 'elevenlabs', error: err.message, sessionId });
    if (!res.headersSent) {
      res.json({ useFallback: true, text: safeText });
    }
  }
}
