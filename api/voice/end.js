/**
 * POST /api/voice/end
 * Vercel-compatible stateless session end.
 * Frontend sends the full conversation for summarization.
 * No server-side session store needed.
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { sessionId, messages = [], leadProfile = {} } = req.body ?? {};

  try {
    // Score the lead from profile data
    const score = calculateLeadScore(leadProfile);
    const priority = getLeadPriority(score);

    // Generate summary
    let summary;
    try {
      summary = await generateSummary(messages, leadProfile);
    } catch {
      summary = buildFallbackSummary(leadProfile);
    }

    console.log('session_ended', { sessionId, score, priority, messageCount: messages.length });

    return res.json({ success: true, summary, score, priority });

  } catch (err) {
    console.error('session_end_error', err);
    return res.status(500).json({ error: 'Failed to end session' });
  }
}

// ── Lead Scoring ─────────────────────────────────────────────────────────────
function calculateLeadScore(lead = {}) {
  let score = 0;
  if (lead.name)    score += 10;
  if (lead.email)   score += 20;
  if (lead.phone)   score += 15;
  if (lead.company) score += 10;
  if (lead.budget)  score += 20;
  if (lead.timeline) score += 10;
  if ((lead.services ?? []).length > 0) score += 15;
  return Math.min(100, score);
}

function getLeadPriority(score) {
  if (score >= 70) return 'hot';
  if (score >= 40) return 'warm';
  return 'cold';
}

// ── Summary Generation via Gemini ─────────────────────────────────────────────
async function generateSummary(messages, leadProfile) {
  if (!process.env.GEMINI_API_KEY || messages.length < 2) {
    return buildFallbackSummary(leadProfile);
  }

  const transcript = messages
    .map(m => `${m.role === 'user' ? 'Client' : 'Aura'}: ${m.content}`)
    .join('\n');

  const prompt = `Analyze this sales conversation and return ONLY a JSON object (no markdown).

Conversation:
${transcript}

Return JSON with these exact fields:
{
  "clientName": "string or Unknown",
  "company": "string or Unknown",
  "requirements": "1-2 sentence summary",
  "painPoints": "key problems mentioned or Not captured",
  "budgetRange": "string or Not mentioned",
  "timeline": "string or Not mentioned",
  "recommendedServices": ["array", "of", "services"],
  "likelihood": 0-100,
  "followUpActions": ["action 1", "action 2", "action 3"]
}`;

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 400 },
    }),
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) throw new Error(`Gemini summary error: ${res.status}`);

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  const cleaned = text.replace(/```json?|```/g, '').trim();
  return JSON.parse(cleaned);
}

function buildFallbackSummary(lead = {}) {
  return {
    clientName: lead.name ?? 'Unknown',
    company: lead.company ?? 'Unknown',
    requirements: `Interested in: ${(lead.services ?? []).join(', ') || 'General enquiry'}`,
    painPoints: 'Not captured',
    budgetRange: lead.budget ?? 'Not mentioned',
    timeline: lead.timeline ?? 'Not mentioned',
    recommendedServices: lead.services ?? [],
    likelihood: 50,
    followUpActions: [
      'Follow up within 24 hours',
      'Send relevant service portfolio',
      'Schedule free strategy call',
    ],
  };
}
