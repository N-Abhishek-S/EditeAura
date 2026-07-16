/**
 * Handoff Engine — triggers human handoff when AI confidence is low
 * or when the user explicitly requests a human.
 */

const HANDOFF_CONFIDENCE_THRESHOLD = 0.65;
const HUMAN_REQUEST_PATTERNS = /\b(human|person|agent|real person|talk to someone|speak to team|connect me|representative|manager)\b/i;

/**
 * Evaluate whether a handoff should be triggered.
 * @param {string} userMessage
 * @param {number} intentConfidence
 * @param {object} session
 * @returns {{ trigger: boolean, reason?: string, message?: string }}
 */
export function evaluateHandoff(userMessage, intentConfidence, session) {
  // Explicit human request
  if (HUMAN_REQUEST_PATTERNS.test(userMessage)) {
    return {
      trigger: true,
      reason: 'user_requested',
      message: "Of course — let me connect you with our team. Can I get your name and the best email to reach you?",
    };
  }

  // Repeated low confidence (3+ consecutive low-confidence turns)
  const lowConfidenceTurns = session._lowConfidenceTurns ?? 0;
  if (intentConfidence < HANDOFF_CONFIDENCE_THRESHOLD) {
    session._lowConfidenceTurns = lowConfidenceTurns + 1;
    if (session._lowConfidenceTurns >= 3) {
      return {
        trigger: true,
        reason: 'low_confidence',
        message: "I want to make sure you get the best help. Let me connect you with one of our specialists — they'll have answers specific to your situation. What's the best way to reach you?",
      };
    }
  } else {
    session._lowConfidenceTurns = 0;
  }

  return { trigger: false };
}

/** Get handoff email notification payload */
export function buildHandoffNotification(session) {
  return {
    type: 'handoff',
    priority: 'HIGH',
    sessionId: session.id,
    reason: session._handoffReason ?? 'unknown',
    lead: session.leadProfile,
    messageCount: session.metrics.messageCount,
    lastMessages: session.messages.slice(-4).map(m => `${m.role}: ${m.content}`).join('\n'),
  };
}
