import 'dotenv/config';
import http from 'http';
import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import contactHandler from './api/contact.js';
import sessionHandler from './api/voice/session.js';
import endHandler from './api/voice/end.js';
import audioHandler from './api/voice/audio.js';
import { attachGateway, getGatewayMetrics } from './api/voice/gateway.js';
import { sessionManager } from './api/lib/core/sessionManager.js';
import { globalLimiter, sessionLimiter, messageLimiter } from './api/lib/core/rateLimiter.js';
import { logger } from './api/lib/core/logger.js';

async function createServer() {
  const app = express();
  const server = http.createServer(app);

  // ── Security Headers ──────────────────────────────────────────────────────
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // ── CORS ──────────────────────────────────────────────────────────────────
  const allowedOrigins = (process.env.ALLOWED_ORIGIN ?? 'http://localhost:5173').split(',');
  app.use(cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }));

  // ── Body Parsing ──────────────────────────────────────────────────────────
  app.use(express.json({ limit: '64kb' })); // Cap request body size
  app.use(express.urlencoded({ extended: true, limit: '16kb' }));

  // ── Global Rate Limiter ───────────────────────────────────────────────────
  app.use('/api/', globalLimiter);

  // ── Audit Logger ──────────────────────────────────────────────────────────
  app.use((req, res, next) => {
    logger.apiRequest({ method: req.method, path: req.path, ip: req.ip });
    next();
  });

  // ── Contact Form (existing) ───────────────────────────────────────────────
  app.post('/api/contact', async (req, res) => {
    try {
      await contactHandler(req, res);
    } catch (error) {
      logger.apiError({ event: 'contact_error', error: error.message });
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });

  // ── Voice Session Lifecycle ───────────────────────────────────────────────
  app.post('/api/voice/session', sessionLimiter, async (req, res) => {
    try { await sessionHandler(req, res); }
    catch (err) { logger.apiError({ event: 'session_error', error: err.message }); res.status(500).json({ error: 'Internal error' }); }
  });

  app.post('/api/voice/end', async (req, res) => {
    try { await endHandler(req, res); }
    catch (err) { logger.apiError({ event: 'end_error', error: err.message }); res.status(500).json({ error: 'Internal error' }); }
  });

  app.post('/api/voice/audio', messageLimiter, async (req, res) => {
    try { await audioHandler(req, res); }
    catch (err) { logger.apiError({ event: 'audio_error', error: err.message }); res.status(500).json({ error: 'Internal error' }); }
  });

  // ── Admin Dashboard ───────────────────────────────────────────────────────
  app.get('/api/admin/dashboard', (req, res) => {
    if (process.env.VITE_FF_ADMIN !== 'true') return res.status(403).json({ error: 'Admin disabled' });
    const sessions = sessionManager.listActive();
    const wss = server._wss;
    res.json({
      activeSessions: sessions.length,
      sessions,
      gateway: getGatewayMetrics(wss),
      timestamp: new Date().toISOString(),
    });
  });

  // ── WebSocket Gateway ─────────────────────────────────────────────────────
  const wss = attachGateway(server);
  server._wss = wss;

  // ── Vite Frontend ─────────────────────────────────────────────────────────
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  // ── Start ─────────────────────────────────────────────────────────────────
  const port = process.env.PORT || 5173;
  server.listen(port, () => {
    console.log(`\n🚀 Edit Aura AI Platform running at http://localhost:${port}`);
    console.log(`🎙️  Voice Gateway: ws://localhost:${port}/api/voice/ws`);
    console.log(`🤖 LLM: ${process.env.GEMINI_API_KEY ? 'Gemini 2.5 Flash' : 'Scripted Fallback'}`);
    console.log(`🔊 TTS: ${process.env.ELEVENLABS_API_KEY ? 'ElevenLabs' : 'Browser SpeechSynthesis'}`);
    console.log(`🎤 STT: ${process.env.DEEPGRAM_API_KEY ? 'Deepgram Live' : 'Web Speech API'}\n`);
  });
}

createServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
