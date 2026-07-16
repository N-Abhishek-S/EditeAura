/**
 * Continuous Lead Extractor — extracts lead fields from every message.
 * Runs on every user message. Updates session.leadProfile progressively.
 * Each field has a confidence threshold — below threshold, AI re-asks.
 */

const CONFIDENCE_THRESHOLDS = {
  name: 0.80, email: 0.97, phone: 0.88,
  company: 0.78, budget: 0.72, timeline: 0.70,
  services: 0.80, country: 0.85,
};

/**
 * Extract lead fields from a piece of text.
 * @param {string} text - User message
 * @param {string} aiReply - AI reply (may reference confirmed fields)
 * @param {object} currentLead - Existing lead profile
 * @returns {{ updates: object, confidence: object, newFields: string[] }}
 */
export function extractLeadFields(text, aiReply, currentLead) {
  const updates = {};
  const confidence = {};
  const newFields = [];

  // ── Email ──────────────────────────────────────────────────────
  const emailMatch = text.match(/\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b/);
  if (emailMatch && !currentLead.email) {
    updates.email = emailMatch[0].toLowerCase();
    confidence.email = 0.97;
    newFields.push('email');
  }

  // ── Phone ──────────────────────────────────────────────────────
  const phoneMatch = text.match(/(?:\+?91[\s\-]?)?[6-9]\d{9}|(?:\+?1[\s\-]?)?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}/);
  if (phoneMatch && !currentLead.phone) {
    updates.phone = phoneMatch[0].replace(/\s/g, '');
    confidence.phone = 0.88;
    newFields.push('phone');
  }

  // ── Budget ─────────────────────────────────────────────────────
  const budgetMatch = text.match(/(?:₹|rs\.?|inr|usd|\$|£|€)\s?[\d,]+(?:k|l|lakh|cr|crore)?|[\d,]+(?:k|l|lakh)?\s?(?:₹|rs|rupees|dollars?|usd)/i);
  if (budgetMatch && !currentLead.budget) {
    updates.budget = budgetMatch[0].trim();
    confidence.budget = 0.82;
    newFields.push('budget');
  }

  // ── Budget (word patterns) ─────────────────────────────────────
  if (!updates.budget && !currentLead.budget) {
    const wordBudget = text.match(/budget\s+(?:is|around|of|about)?\s*(\S+)/i);
    if (wordBudget) {
      updates.budget = wordBudget[1];
      confidence.budget = 0.72;
      newFields.push('budget');
    }
  }

  // ── Timeline ───────────────────────────────────────────────────
  const timelineMatch = text.match(/\b(\d+)\s*(week|month|day|year)s?\b|\b(asap|urgent|immediately|soon|flexible|no rush)\b/i);
  if (timelineMatch && !currentLead.timeline) {
    updates.timeline = timelineMatch[0];
    confidence.timeline = 0.78;
    newFields.push('timeline');
  }

  // ── Name (from AI reply context) ──────────────────────────────
  // "My name is X" or "I'm X" or "Call me X"
  const nameMatch = text.match(/(?:my name is|i(?:'m| am)|call me)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
  if (nameMatch && !currentLead.name) {
    updates.name = nameMatch[1].trim();
    confidence.name = 0.85;
    newFields.push('name');
  }

  // ── Services ───────────────────────────────────────────────────
  const serviceKeywords = {
    'Website Development': /\b(website|web app|landing page|ecommerce|online store)\b/i,
    'AI Automation': /\b(ai|automation|agent|chatbot|workflow|bot)\b/i,
    'Social Media': /\b(social media|instagram|reels|content|youtube)\b/i,
    'SEO': /\b(seo|ranking|organic|google)\b/i,
    'Branding': /\b(brand|logo|identity|design)\b/i,
  };
  const detectedServices = Object.entries(serviceKeywords)
    .filter(([, pattern]) => pattern.test(text))
    .map(([service]) => service);

  if (detectedServices.length) {
    const existing = currentLead.services ?? [];
    const merged = [...new Set([...existing, ...detectedServices])];
    if (merged.length > existing.length) {
      updates.services = merged;
      confidence.services = 0.85;
      if (!existing.length) newFields.push('services');
    }
  }

  // Validate fields that need re-asking (below confidence threshold)
  const reAsk = Object.entries(confidence)
    .filter(([field, conf]) => conf < CONFIDENCE_THRESHOLDS[field])
    .map(([field]) => field);

  return { updates, confidence, newFields, reAsk };
}

/**
 * Calculate lead score (0–100).
 * @param {object} lead
 * @returns {number}
 */
export function calculateLeadScore(lead) {
  const weights = {
    name: 5, email: 15, phone: 10, company: 8,
    budget: 15, timeline: 10, services: 12, projectDescription: 5,
  };

  let fieldScore = 0;
  let maxField = 0;
  for (const [field, weight] of Object.entries(weights)) {
    maxField += weight;
    const val = lead[field];
    if (val && !(Array.isArray(val) && val.length === 0)) fieldScore += weight;
  }

  const fieldPct = (fieldScore / maxField) * 40;

  // Budget tier (0–25)
  let budgetScore = 0;
  if (lead.budget) {
    const raw = lead.budget.replace(/[^\d]/g, '');
    const amount = parseInt(raw, 10) || 0;
    if (amount >= 100000) budgetScore = 25;
    else if (amount >= 50000) budgetScore = 20;
    else if (amount >= 25000) budgetScore = 15;
    else if (amount >= 10000) budgetScore = 8;
    else budgetScore = 3;
  }

  // Engagement (0–20) — based on services count
  const engagementScore = Math.min(20, (lead.services?.length ?? 0) * 7);

  // Urgency (0–15)
  const urgencyScore = /urgent|asap|immediately|soon|this month|next month/i.test(lead.timeline ?? '') ? 15 : 5;

  return Math.round(fieldPct + budgetScore + engagementScore + urgencyScore);
}

/** Determine priority from score */
export function getLeadPriority(score) {
  if (score >= 80) return 'hot';
  if (score >= 50) return 'warm';
  return 'cold';
}
