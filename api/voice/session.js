/**
 * POST /api/voice/session
 * Vercel-compatible stateless session starter.
 * Returns a sessionId (UUID) + greeting. No server-side state stored.
 */
import { randomUUID } from 'crypto';

const GREETING = "Hello! I'm Aura, Edit Aura's AI Business Consultant. I can help you understand our services, estimate project costs, or schedule a strategy call. What can I help you with today?";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const sessionId = randomUUID();

    return res.json({
      sessionId,
      resumed: false,
      greeting: GREETING,
      voiceConfig: {
        useBrowserTTS: !process.env.ELEVENLABS_API_KEY,
        useWebSpeech: !process.env.DEEPGRAM_API_KEY,
        useRestFallback: true, // Always true on Vercel — no WebSocket
      },
      featureFlags: {
        voice: process.env.VITE_FF_VOICE !== 'false',
        transcript: true,
        llm: true,
        booking: true,
        analytics: false,
        email: false,
        rag: false,
        handoff: false,
        admin: false,
        costDisplay: false,
      },
    });
  } catch (err) {
    console.error('session_create_error', err);
    return res.status(500).json({ error: 'Failed to create session' });
  }
}
