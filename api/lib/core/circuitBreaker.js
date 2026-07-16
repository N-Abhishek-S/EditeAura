import { logger } from './logger.js';

/**
 * Circuit Breaker — prevents cascading failures.
 * States: CLOSED (normal) → OPEN (failing) → HALF_OPEN (testing recovery)
 */
export class CircuitBreaker {
  /**
   * @param {string} name - Provider name for logging
   * @param {Function} fallback - Called when circuit is OPEN
   * @param {object} options
   * @param {number} options.threshold - Failures before opening (default: 3)
   * @param {number} options.timeout - ms before attempting HALF_OPEN (default: 30000)
   * @param {number} options.successThreshold - Successes in HALF_OPEN before closing (default: 2)
   */
  constructor(name, fallback, { threshold = 3, timeout = 30_000, successThreshold = 2 } = {}) {
    this.name = name;
    this.fallback = fallback;
    this.threshold = threshold;
    this.timeout = timeout;
    this.successThreshold = successThreshold;

    this.state = 'CLOSED';
    this.failures = 0;
    this.successes = 0;
    this.lastFailureTime = null;
    this.metrics = { totalCalls: 0, totalFailures: 0, totalFallbacks: 0 };
  }

  async call(fn) {
    this.metrics.totalCalls++;

    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
        logger.circuitBreaker({ name: this.name, state: 'HALF_OPEN', msg: 'Testing recovery' });
      } else {
        this.metrics.totalFallbacks++;
        logger.circuitBreaker({ name: this.name, state: 'OPEN', msg: 'Using fallback' });
        return this.fallback();
      }
    }

    try {
      const result = await fn();
      this._onSuccess();
      return result;
    } catch (err) {
      this._onFailure(err);
      this.metrics.totalFallbacks++;
      logger.providerFail({ name: this.name, error: err.message });
      return this.fallback(err);
    }
  }

  _onSuccess() {
    this.failures = 0;
    if (this.state === 'HALF_OPEN') {
      this.successes++;
      if (this.successes >= this.successThreshold) {
        this.state = 'CLOSED';
        this.successes = 0;
        logger.circuitBreaker({ name: this.name, state: 'CLOSED', msg: 'Recovery confirmed' });
      }
    }
  }

  _onFailure(err) {
    this.failures++;
    this.lastFailureTime = Date.now();
    this.metrics.totalFailures++;
    if (this.state === 'HALF_OPEN') {
      this.state = 'OPEN';
      logger.circuitBreaker({ name: this.name, state: 'OPEN', error: err.message });
    } else if (this.failures >= this.threshold) {
      this.state = 'OPEN';
      logger.circuitBreaker({ name: this.name, state: 'OPEN', failures: this.failures });
    }
  }

  getMetrics() {
    return { name: this.name, state: this.state, ...this.metrics };
  }
}
