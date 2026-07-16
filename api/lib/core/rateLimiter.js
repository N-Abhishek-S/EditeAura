import { logger } from './logger.js';

/**
 * Sliding-window rate limiter — no Redis dependency.
 * Redis-compatible interface for drop-in upgrade.
 */
class RateLimiter {
  constructor() {
    this._windows = new Map(); // key → { count, timestamps[] }
  }

  /**
   * Check and increment rate limit.
   * @param {string} key - IP or sessionId
   * @param {number} limit - max requests
   * @param {number} windowMs - window size in ms
   * @returns {{ allowed: boolean, remaining: number, resetAt: number }}
   */
  check(key, limit, windowMs) {
    const now = Date.now();
    if (!this._windows.has(key)) {
      this._windows.set(key, []);
    }
    const timestamps = this._windows.get(key);

    // Remove expired entries
    const cutoff = now - windowMs;
    while (timestamps.length && timestamps[0] < cutoff) timestamps.shift();

    if (timestamps.length >= limit) {
      return { allowed: false, remaining: 0, resetAt: timestamps[0] + windowMs };
    }

    timestamps.push(now);
    return { allowed: true, remaining: limit - timestamps.length, resetAt: now + windowMs };
  }

  /** Express middleware factory */
  middleware({ limit, windowMs, keyFn = (req) => req.ip }) {
    return (req, res, next) => {
      const key = keyFn(req);
      const result = this.check(key, limit, windowMs);

      res.setHeader('X-RateLimit-Limit', limit);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      res.setHeader('X-RateLimit-Reset', Math.ceil(result.resetAt / 1000));

      if (!result.allowed) {
        logger.warn('rate_limit_hit', { key, limit, windowMs });
        return res.status(429).json({ success: false, message: 'Too many requests. Please slow down.' });
      }
      next();
    };
  }
}

export const rateLimiter = new RateLimiter();

// Pre-configured limiters for different routes
export const sessionLimiter = rateLimiter.middleware({ limit: 20, windowMs: 60 * 60 * 1000 });
export const messageLimiter = rateLimiter.middleware({ limit: 60, windowMs: 60 * 60 * 1000, keyFn: (req) => req.body?.sessionId ?? req.ip });
export const adminLimiter   = rateLimiter.middleware({ limit: 100, windowMs: 60 * 1000 });
export const globalLimiter  = rateLimiter.middleware({ limit: 200, windowMs: 60 * 1000 });
