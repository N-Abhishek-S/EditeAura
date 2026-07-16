import { AGENT_PROMPTS } from './agentRouter.js';

/**
 * Prompt Engine — 8-layer prompt construction.
 * Each layer is independently swappable.
 */

const QUALIFICATION_RULES = `
LEAD QUALIFICATION RULES:
- Collect: name, company, email, budget, timeline, service interest — naturally through conversation
- Never ask for all fields at once — one per 2–3 turns maximum
- If budget is mentioned, acknowledge it and continue naturally
- If budget < ₹10,000, gently set expectations and still qualify for our entry packages
- If budget > ₹1,00,000, flag as high-value and prioritize booking a call
- Always offer a strategy call before conversation ends
- Never fabricate pricing — use ranges from business context
- Keep responses under 80 words for voice delivery
- Use natural pauses: after questions, after pricing, after recommendations
`;

const RESPONSE_FORMAT_RULES = `
RESPONSE FORMAT FOR VOICE:
- Maximum 2–3 sentences per response (voice delivery)
- No bullet points, no markdown, no emojis in spoken responses
- End every response with either a question or a clear next step
- Speak naturally as if in a phone call — contractions are fine (I'm, we've, that's)
- Avoid filler phrases: "Certainly!", "Of course!", "Absolutely!" — just respond
`;

/**
 * Build the complete prompt for a conversation turn.
 * @param {object} options
 * @param {string} options.agentId
 * @param {object} options.session
 * @param {string} options.memory - Summarized conversation history
 * @param {string[]} options.ragDocs - Retrieved knowledge chunks
 * @param {string} options.intent
 * @param {number} options.intentConfidence
 * @param {object} options.leadProfile
 * @param {string} options.userMessage
 * @returns {Array<{role: string, content: string}>}
 */
export function buildPrompt({ agentId, session, memory, ragDocs = [], intent, intentConfidence = 1, leadProfile, userMessage }) {
  const systemParts = [
    // Layer 1: Agent identity
    AGENT_PROMPTS[agentId] ?? AGENT_PROMPTS.business_consultant,

    // Layer 2: Business rules
    QUALIFICATION_RULES,

    // Layer 3: Voice response format
    RESPONSE_FORMAT_RULES,

    // Layer 4: RAG context (dynamic — from knowledge base)
    ragDocs.length
      ? `RELEVANT KNOWLEDGE:\n${ragDocs.map(d => `[${d.title}]: ${d.content}`).join('\n\n')}`
      : '',

    // Layer 5: Lead profile state
    buildLeadContext(leadProfile),

    // Layer 6: Intent context
    `Current conversation intent: ${intent} (confidence: ${Math.round(intentConfidence * 100)}%)`,
    intentConfidence < 0.65 ? 'Note: Confidence is low — consider offering to connect with a human team member.' : '',

    // Layer 7: Session goal
    `Session goal: ${session.goalId} — ${Math.round(session.goalCompletionPct)}% complete`,
  ].filter(Boolean).join('\n\n');

  const messages = [
    { role: 'system', content: systemParts },
  ];

  // Layer 8: Conversation history (summarized memory)
  if (memory) {
    messages.push({ role: 'user', content: `[Conversation so far]: ${memory}` });
    messages.push({ role: 'assistant', content: 'Understood. Continuing...' });
  }

  // Add recent raw messages (last 6 turns max)
  const recentMessages = (session.messages ?? []).slice(-12);
  for (const msg of recentMessages) {
    messages.push({ role: msg.role, content: msg.content });
  }

  // Final user message
  messages.push({ role: 'user', content: userMessage });

  return messages;
}

function buildLeadContext(lead) {
  if (!lead) return '';
  const filled = Object.entries(lead)
    .filter(([, v]) => v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0))
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
    .join(', ');

  const missing = Object.entries(lead)
    .filter(([, v]) => !v || (Array.isArray(v) && v.length === 0))
    .map(([k]) => k);

  const parts = [];
  if (filled) parts.push(`Lead data captured: ${filled}`);
  if (missing.length) parts.push(`Still needed: ${missing.join(', ')}`);
  return parts.join('\n');
}

/** Build the summary generation prompt */
export function buildSummaryPrompt(session) {
  const transcript = session.messages
    .map(m => `${m.role === 'user' ? 'Client' : 'Aura'}: ${m.content}`)
    .join('\n');

  return [
    { role: 'system', content: 'You are a CRM analyst. Extract structured lead information from conversation transcripts. Return valid JSON only — no prose, no markdown code fences.' },
    { role: 'user', content: `Analyze this conversation and return JSON with these exact keys: clientName, company, requirements, painPoints, budgetRange, timeline, recommendedServices (array), likelihood (0-100 integer), followUpActions (array of strings).\n\nTranscript:\n${transcript}` },
  ];
}
