/**
 * Intent Engine — classifies each message into a business intent.
 * Uses keyword matching (fast, zero cost) with LLM override for ambiguous cases.
 */

const INTENT_PATTERNS = {
  pricing:       /\b(price|cost|how much|budget|charge|fee|rate|affordable|expensive|package|plan|quote)\b/i,
  booking:       /\b(book|schedule|call|meeting|appointment|consult|talk|speak|demo|calendly|slot|available)\b/i,
  website:       /\b(website|web|landing page|e-commerce|ecommerce|online store|shop|portfolio|blog|wordpress|wix|shopify)\b/i,
  ai_automation: /\b(ai|artificial intelligence|automation|agent|chatbot|bot|workflow|crm|whatsapp bot|lead gen|pipeline|n8n|zapier|make|automate)\b/i,
  social_media:  /\b(social media|instagram|reels|content|video|youtube|linkedin|tiktok|facebook|followers|engagement|viral|growth)\b/i,
  seo:           /\b(seo|ranking|google|search engine|organic|keyword|traffic|backlink|domain authority)\b/i,
  branding:      /\b(brand|logo|identity|design|visual|colour|color|typography|style guide|ui|ux)\b/i,
  support:       /\b(issue|problem|bug|revision|change|update|complaint|delay|help|support)\b/i,
  general:       null, // fallback
};

/**
 * Classify the intent of a user message.
 * @param {string} text
 * @param {string} [currentIntent] - Previous intent for continuity bias
 * @returns {{ intent: string, confidence: number, isHandoffCandidate: boolean }}
 */
export function classifyIntent(text, currentIntent = 'general') {
  let bestIntent = null;
  let bestScore = 0;

  for (const [intent, pattern] of Object.entries(INTENT_PATTERNS)) {
    if (!pattern) continue;
    const matches = (text.match(pattern) ?? []).length;
    const score = matches / (text.split(' ').length / 4); // normalize by message length
    if (score > bestScore) { bestScore = score; bestIntent = intent; }
  }

  if (!bestIntent) {
    // Continuity: keep previous intent if new message is short and conversational
    bestIntent = text.length < 30 ? currentIntent : 'general';
    bestScore = 0.5;
  }

  const confidence = Math.min(0.95, 0.6 + bestScore * 0.4);

  return {
    intent: bestIntent,
    confidence,
    isHandoffCandidate: confidence < 0.65,
    bookingRequired: bestIntent === 'booking',
  };
}

/**
 * Session Goals — tracks what fields are needed for success.
 */
const GOALS = {
  LEAD_QUALIFICATION: { required: ['name', 'email', 'budget', 'services'], weight: 1 },
  TECHNICAL_SCOPING:  { required: ['name', 'projectDescription', 'budget', 'timeline'], weight: 1 },
  BOOKING:            { required: ['name', 'email'], weight: 1 },
  CONFIRM_BOOKING:    { required: ['name', 'email'], weight: 1 },
  SUPPORT_RESOLUTION: { required: ['name', 'email'], weight: 1 },
};

/**
 * Calculate session goal completion percentage.
 * @param {string} goalId
 * @param {object} leadProfile
 * @returns {number} 0–100
 */
export function calculateGoalCompletion(goalId, leadProfile) {
  const goal = GOALS[goalId];
  if (!goal) return 0;
  const filled = goal.required.filter(field => {
    const val = leadProfile[field];
    return val && !(Array.isArray(val) && val.length === 0);
  });
  return Math.round((filled.length / goal.required.length) * 100);
}
