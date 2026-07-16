import { WebSocketServer } from 'ws';
import { sessionManager } from '../lib/core/sessionManager.js';
import { processTurn, injectProviders } from '../lib/core/conversationOrchestrator.js';
import { GeminiProvider } from '../lib/providers/llm/GeminiProvider.js';
import { ScriptedProvider } from '../lib/providers/llm/ScriptedProvider.js';
import { ElevenLabsProvider } from '../lib/providers/voice/ElevenLabsProvider.js';
import { SynthesisProvider } from '../lib/providers/voice/SynthesisProvider.js';
import { CircuitBreaker } from '../lib/core/circuitBreaker.js';
import { logger } from '../lib/core/logger.js';
import sanitizeHtml from 'sanitize-html';

// ── Provider Cascade ──────────────────────────────────────────────────────────

const llmProvider = process.env.GEMINI_API_KEY
  ? new GeminiProvider(process.env.GEMINI_API_KEY, process.env.GEMINI_MODEL ?? 'gemini-2.5-flash')
  : new ScriptedProvider();

const voiceProvider = process.env.ELEVENLABS_API_KEY
  ? new ElevenLabsProvider(process.env.ELEVENLABS_API_KEY)
  : new SynthesisProvider();

// Circuit breakers with fallbacks
const llmCircuitBreaker = new CircuitBreaker('llm', () => new ScriptedProvider().complete([]), { threshold: 3 });
const voiceCircuitBreaker = new CircuitBreaker('voice', () => null, { threshold: 3 });

// Wrap providers with circuit breakers
const protectedLLM = {
  ...llmProvider,
  complete: (msgs, tools) => llmCircuitBreaker.call(() => llmProvider.complete(msgs, tools)),
  isAvailable: () => llmProvider.isAvailable(),
  get name() { return llmProvider.name; },
  get model() { return llmProvider.model; },
};

const protectedVoice = {
  ...voiceProvider,
  stream: (text, config) => voiceProvider.isAvailable()
    ? voiceCircuitBreaker.call(() => voiceProvider.stream(text, config))
    : (async function* () { yield null; })(),
  isAvailable: () => voiceProvider.isAvailable(),
  get name() { return voiceProvider.name; },
};

// Inject into orchestrator
injectProviders({ llmProvider: protectedLLM, voiceProvider: protectedVoice });

// ── Prompt Injection Filter ───────────────────────────────────────────────────

const INJECTION_PATTERNS = [
  /ignore previous instructions?/i,
  /system\s*:/i,
  /<\|im_start\|>/i,
  /\[INST\]/i,
  /forget (your|all) instructions?/i,
  /act as (a|an) (?!Edit Aura)/i,
  /jailbreak/i,
  /DAN mode/i,
];

function sanitizeMessage(text) {
  // Strip HTML
  let clean = sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} });
  // Check prompt injection
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(clean)) {
      logger.warn('prompt_injection_blocked', { text: clean.slice(0, 100) });
      return null; // Block
    }
  }
  return clean.slice(0, 1000); // Cap at 1000 chars
}

// ── WebSocket Gateway ─────────────────────────────────────────────────────────

/**
 * Attach WebSocket gateway to an HTTP server.
 * @param {import('http').Server} server
 */
export function attachGateway(server) {
  const wss = new WebSocketServer({ server, path: '/api/voice/ws' });

  logger.info('gateway_started', { path: '/api/voice/ws' });

  wss.on('connection', (ws, req) => {
    let sessionId = null;
    let pingInterval = null;
    const clientIp = req.socket.remoteAddress;

    logger.wsEvent({ event: 'ws_connected', ip: clientIp });

    // Heartbeat — detect dead connections
    ws.isAlive = true;
    ws.on('pong', () => { ws.isAlive = true; });
    pingInterval = setInterval(() => {
      if (!ws.isAlive) {
        logger.wsEvent({ event: 'ws_dead', sessionId });
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    }, 30000);

    function send(message) {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify(message));
      }
    }

    ws.on('message', async (raw) => {
      let msg;
      try {
        msg = JSON.parse(raw.toString());
      } catch {
        send({ type: 'error', code: 'INVALID_JSON', message: 'Invalid message format' });
        return;
      }

      // Validate session on every message
      if (msg.sessionId) {
        sessionId = msg.sessionId;
        const session = sessionManager.get(sessionId);
        if (!session) {
          send({ type: 'error', code: 'SESSION_EXPIRED', message: 'Session expired. Please refresh.' });
          return;
        }
      }

      switch (msg.type) {
        case 'ping':
          send({ type: 'pong' });
          break;

        case 'text_message': {
          if (!sessionId) { send({ type: 'error', code: 'NO_SESSION' }); return; }
          const session = sessionManager.get(sessionId);
          if (!session) { send({ type: 'error', code: 'SESSION_EXPIRED' }); return; }

          const safeText = sanitizeMessage(msg.text ?? '');
          if (!safeText) {
            send({ type: 'error', code: 'BLOCKED', message: 'Message could not be processed.' });
            return;
          }

          logger.wsEvent({ event: 'message_received', sessionId, textLength: safeText.length });
          await processTurn(session, safeText, send);
          break;
        }

        case 'audio_chunk': {
          // Deepgram proxy: client sends base64 PCM, we forward to Deepgram
          // Activated when DEEPGRAM_API_KEY is set — not implemented in Phase 0
          // (Web Speech API handles STT on frontend in Phase 0)
          logger.wsEvent({ event: 'audio_chunk_received', sessionId });
          break;
        }

        case 'end_session': {
          if (sessionId) {
            sessionManager.end(sessionId);
            send({ type: 'session_ended' });
          }
          ws.close();
          break;
        }

        default:
          send({ type: 'error', code: 'UNKNOWN_MESSAGE_TYPE', message: `Unknown type: ${msg.type}` });
      }
    });

    ws.on('close', () => {
      clearInterval(pingInterval);
      logger.wsEvent({ event: 'ws_closed', sessionId });
    });

    ws.on('error', (err) => {
      logger.error('ws_error', { sessionId, error: err.message });
    });

    // Send connection confirmation
    send({ type: 'connected', message: 'Voice gateway ready' });
  });

  // Periodic health check
  setInterval(() => {
    wss.clients.forEach(ws => {
      if (!ws.isAlive) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  return wss;
}

/** Get gateway health metrics */
export function getGatewayMetrics(wss) {
  return {
    activeConnections: wss?.clients?.size ?? 0,
    llmCircuitState: llmCircuitBreaker.state,
    voiceCircuitState: voiceCircuitBreaker.state,
    llmProvider: llmProvider.name,
    voiceProvider: voiceProvider.name,
  };
}
