/**
 * Background Job Queue — async post-session processing.
 * Interface-compatible with BullMQ for drop-in Redis upgrade.
 */
import { logger } from './logger.js';

const RETRY_DELAY_MS = 5000;
const MAX_RETRIES = 2;

class JobQueue {
  constructor() {
    this._inFlight = new Set();
  }

  /**
   * Enqueue a background job. Non-blocking.
   * @param {string} jobType
   * @param {object} payload
   */
  enqueue(jobType, payload) {
    const jobId = `${jobType}-${Date.now()}`;
    this._inFlight.add(jobId);

    setImmediate(() => this._execute(jobId, jobType, payload, 0));
  }

  async _execute(jobId, jobType, payload, attempt) {
    try {
      const handler = HANDLERS[jobType];
      if (!handler) throw new Error(`Unknown job type: ${jobType}`);
      await handler(payload);
      logger.info('job_completed', { jobId, jobType, attempt });
    } catch (err) {
      logger.error('job_failed', { jobId, jobType, attempt, error: err.message });
      if (attempt < MAX_RETRIES) {
        setTimeout(() => this._execute(jobId, jobType, payload, attempt + 1), RETRY_DELAY_MS);
        return;
      }
    }
    this._inFlight.delete(jobId);
  }

  get pendingCount() { return this._inFlight.size; }
}

// Handlers are injected at runtime to avoid circular imports
const HANDLERS = {};

export function registerHandler(jobType, fn) {
  HANDLERS[jobType] = fn;
}

export const jobQueue = new JobQueue();
