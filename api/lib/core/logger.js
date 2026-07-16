/**
 * Structured logger — JSON output compatible with any log aggregator.
 * Tracks per-provider latency, errors, token usage, and costs.
 */

const LOG_LEVEL = { debug: 0, info: 1, warn: 2, error: 3 };
const CURRENT_LEVEL = LOG_LEVEL[process.env.LOG_LEVEL ?? 'info'];

function log(level, event, meta = {}) {
  if (LOG_LEVEL[level] < CURRENT_LEVEL) return;
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...meta,
  };
  // Anonymize IPs
  if (entry.ip) {
    const parts = entry.ip.split('.');
    if (parts.length === 4) entry.ip = `${parts[0]}.${parts[1]}.xxx.xxx`;
  }
  console[level === 'error' ? 'error' : 'log'](JSON.stringify(entry));
}

export const logger = {
  debug: (event, meta) => log('debug', event, meta),
  info:  (event, meta) => log('info', event, meta),
  warn:  (event, meta) => log('warn', event, meta),
  error: (event, meta) => log('error', event, meta),

  // Convenience: provider-specific structured events
  llmCall:    (meta) => log('info',  'llm_call', meta),
  sttEvent:   (meta) => log('info',  'stt_event', meta),
  ttsStream:  (meta) => log('info',  'tts_stream', meta),
  apiRequest: (meta) => log('info',  'api_request', meta),
  apiError:   (meta) => log('error', 'api_error', meta),
  wsEvent:    (meta) => log('info',  'ws_event', meta),
  circuitBreaker: (meta) => log('warn', 'circuit_breaker', meta),
  providerFail:   (meta) => log('error', 'provider_failure', meta),
};
