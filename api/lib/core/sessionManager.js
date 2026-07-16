import { randomUUID } from 'crypto';
import { logger } from './logger.js';

/**
 * In-memory Session Manager — Redis-compatible interface.
 * Stores all active voice sessions. Sessions expire after 30 minutes of inactivity.
 */
class SessionManager {
  constructor() {
    this._sessions = new Map();
    this._EXPIRY_MS = 30 * 60 * 1000; // 30 minutes
    // Sweep expired sessions every 5 minutes
    setInterval(() => this._sweep(), 5 * 60 * 1000);
  }

  /**
   * Create a new session.
   * @param {object} meta - { userAgent, deviceType, timezone, referrer, language }
   * @returns {object} session
   */
  create(meta = {}) {
    const id = randomUUID();
    const session = {
      id,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      status: 'active',
      agentId: 'business_consultant',
      persona: 'business_consultant',
      language: meta.language ?? 'en',
      timezone: meta.timezone ?? 'Asia/Kolkata',
      device: meta.deviceType ?? 'unknown',
      browser: meta.userAgent ?? 'unknown',
      referrer: meta.referrer ?? '',
      messages: [],
      leadProfile: {
        name: null, email: null, phone: null, company: null,
        country: null, budget: null, timeline: null,
        services: [], projectDescription: null,
      },
      confidence: {},
      intent: 'general',
      intentHistory: [],
      goalId: 'LEAD_QUALIFICATION',
      goalCompletionPct: 0,
      costs: { deepgram: 0, gemini: 0, elevenlabs: 0, total: 0 },
      metrics: {
        messageCount: 0, ragQueries: 0, toolCalls: 0,
        handoffs: 0, avgLatencyMs: 0, firstResponseMs: null,
      },
    };

    this._sessions.set(id, session);
    logger.info('session_created', { sessionId: id, device: meta.deviceType });
    return session;
  }

  /** @param {string} id @returns {object|null} */
  get(id) {
    const session = this._sessions.get(id);
    if (!session) return null;
    // Check expiry
    if (Date.now() - session.lastActivity > this._EXPIRY_MS) {
      this._sessions.delete(id);
      return null;
    }
    session.lastActivity = Date.now();
    return session;
  }

  /** @param {string} id @param {object} updates */
  update(id, updates) {
    const session = this.get(id);
    if (!session) return null;
    Object.assign(session, updates);
    session.lastActivity = Date.now();
    return session;
  }

  /** Add a message to session history */
  addMessage(id, message) {
    const session = this.get(id);
    if (!session) return;
    session.messages.push({ ...message, timestamp: Date.now() });
    session.metrics.messageCount++;
    session.lastActivity = Date.now();
  }

  /** @param {string} id */
  end(id) {
    const session = this.get(id);
    if (session) session.status = 'ended';
    return session;
  }

  /** Delete session */
  delete(id) { this._sessions.delete(id); }

  /** Return all active session IDs + lightweight metadata */
  listActive() {
    const now = Date.now();
    return [...this._sessions.values()]
      .filter(s => s.status === 'active' && now - s.lastActivity < this._EXPIRY_MS)
      .map(s => ({
        id: s.id, createdAt: s.createdAt, device: s.device,
        intent: s.intent, goalCompletionPct: s.goalCompletionPct,
        messageCount: s.metrics.messageCount,
      }));
  }

  _sweep() {
    const now = Date.now();
    for (const [id, session] of this._sessions) {
      if (now - session.lastActivity > this._EXPIRY_MS) {
        this._sessions.delete(id);
        logger.info('session_expired', { sessionId: id });
      }
    }
  }
}

export const sessionManager = new SessionManager();
