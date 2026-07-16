import { logger } from './logger.js';

/**
 * Cost Tracker — tracks Deepgram, Gemini, ElevenLabs costs per session.
 * All pricing as of 2024. Update PRICING constants when rates change.
 */

const PRICING = {
  deepgram: { perSecond: 0.0059 / 60 },          // Nova-2: $0.0059/min
  gemini_flash: {
    perInputToken:  0.000000075,                   // $0.075 per 1M input tokens
    perOutputToken: 0.0000003,                     // $0.30 per 1M output tokens
  },
  elevenlabs: { perCharacter: 0.00003 },           // Turbo v2.5: ~$0.30/1000 chars
};

/**
 * @param {object} session
 * @param {object} usage - { sttSeconds?, inputTokens?, outputTokens?, ttsChars? }
 */
export function trackCosts(session, usage = {}) {
  const costs = session.costs ?? { deepgram: 0, gemini: 0, elevenlabs: 0, total: 0 };

  if (usage.sttSeconds) {
    costs.deepgram += usage.sttSeconds * PRICING.deepgram.perSecond;
  }
  if (usage.inputTokens || usage.outputTokens) {
    costs.gemini += (usage.inputTokens ?? 0) * PRICING.gemini_flash.perInputToken
                  + (usage.outputTokens ?? 0) * PRICING.gemini_flash.perOutputToken;
  }
  if (usage.ttsChars) {
    costs.elevenlabs += usage.ttsChars * PRICING.elevenlabs.perCharacter;
  }

  costs.total = costs.deepgram + costs.gemini + costs.elevenlabs;
  session.costs = costs;

  logger.info('cost_update', {
    sessionId: session.id,
    deepgramUsd: costs.deepgram.toFixed(6),
    geminiUsd: costs.gemini.toFixed(6),
    elevenLabsUsd: costs.elevenlabs.toFixed(6),
    totalUsd: costs.total.toFixed(6),
  });

  return costs;
}

/** Format costs for WebSocket emission */
export function formatCostUpdate(session) {
  const c = session.costs ?? { deepgram: 0, gemini: 0, elevenlabs: 0, total: 0 };
  return {
    type: 'cost_update',
    deepgram:   parseFloat(c.deepgram.toFixed(5)),
    gemini:     parseFloat(c.gemini.toFixed(5)),
    elevenlabs: parseFloat(c.elevenlabs.toFixed(5)),
    total:      parseFloat(c.total.toFixed(5)),
  };
}
