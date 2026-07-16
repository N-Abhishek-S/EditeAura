/**
 * POST /api/voice/message
 *
 * Stateless Vercel-compatible message handler.
 * The frontend sends the full conversation history on every turn.
 * No in-memory session store needed — works perfectly on serverless.
 *
 * Request body:
 *   { sessionId, messages: [{role, content}], leadProfile, intent }
 *
 * Response:
 *   { reply, intent, leadUpdate, goalCompletionPct }
 */

import sanitizeHtml from 'sanitize-html';

// ── Prompt Injection Filter ────────────────────────────────────────────────────
const INJECTION_PATTERNS = [
  /ignore previous instructions?/i,
  /system\s*:/i,
  /<\|im_start\|>/i,
  /\[INST\]/i,
  /forget (your|all) instructions?/i,
  /jailbreak/i,
  /DAN mode/i,
];

function sanitizeInput(text) {
  if (!text || typeof text !== 'string') return null;
  const clean = sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} });
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(clean)) return null;
  }
  return clean.slice(0, 1000);
}

// ── Edit Aura System Prompt ───────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Aura — Edit Aura's AI Business Consultant. You are professional, warm, and knowledgeable.

ABOUT EDIT AURA:
Edit Aura is a premium AI Automation & Digital Growth Agency based in India.

SERVICES & PRICING (always quote in ₹ INR):
- Website Development: ₹25,000 – ₹1,50,000 (depends on complexity, e-commerce, animations)
- AI Automation & Chatbots: ₹40,000 – ₹2,00,000 (lead gen, workflow automation, custom AI tools)
- Social Media Management: ₹15,000/month – ₹50,000/month (content, strategy, growth)
- Brand Identity & Design: ₹20,000 – ₹80,000 (logo, guidelines, full brand kit)
- SEO & Content Strategy: ₹12,000/month – ₹40,000/month
- Video Production & Editing: ₹10,000 – ₹60,000 per project
- Performance Marketing: ₹15,000/month + ad spend (Meta, Google)

CONTACT:
- Email: editaura.ea@gmail.com
- Strategy call: Free 30-minute consultation

YOUR ROLE:
1. Answer questions about services, pricing, timelines clearly
2. Understand the client's business needs
3. Gently qualify: ask about budget, timeline, goals
4. When appropriate, recommend a free strategy call
5. Be concise — responses under 80 words unless asked for detail
6. Never make up prices outside the ranges above
7. If asked something outside your knowledge, say so and offer to connect them with the team

IMPORTANT:
- You are NOT a general-purpose AI. Only discuss Edit Aura services and client business needs.
- Do not answer questions about competitors, politics, coding tutorials, or unrelated topics.
- Always maintain a professional, premium brand voice.`;

// ── Scripted Fallback Responses ───────────────────────────────────────────────
const SCRIPTED_RESPONSES = [
  {
    patterns: [/price|cost|how much|pricing|rate|charge|fee|package|₹|rupee/i],
    reply: "Our pricing depends on the scope of your project. Website development starts from ₹25,000, AI automation from ₹40,000, and social media management from ₹15,000/month. Could you tell me more about your business goals so I can give you a more accurate estimate?",
    intent: 'pricing',
    services: ['Website Development'],
  },
  {
    patterns: [/website|web|site|landing page|e-commerce|ecommerce|shop|store/i],
    reply: "We build everything from sleek business websites to full e-commerce platforms. Our website development packages start from ₹25,000 for a professional site. What kind of website are you looking to build — business showcase, e-commerce, or something else?",
    intent: 'website',
    services: ['Website Development'],
  },
  {
    patterns: [/ai|automation|chatbot|bot|workflow|integrate|crm|whatsapp/i],
    reply: "Our AI automation services are a game-changer for businesses. We build custom AI chatbots, lead qualification systems, WhatsApp automation, and CRM integrations. Packages start from ₹40,000. What processes in your business are you looking to automate?",
    intent: 'ai_automation',
    services: ['AI Automation'],
  },
  {
    patterns: [/social media|instagram|facebook|content|post|growth|follower/i],
    reply: "We manage social media for brands that want consistent growth. Our packages start from ₹15,000/month and include content creation, strategy, and community management. Which platforms are you most focused on — Instagram, Facebook, LinkedIn?",
    intent: 'social_media',
    services: ['Social Media Management'],
  },
  {
    patterns: [/seo|search engine|google ranking|keyword|traffic|organic/i],
    reply: "Our SEO & content strategy packages start from ₹12,000/month and focus on long-term organic growth. We handle technical SEO, content creation, and link building. What's your current online presence like?",
    intent: 'seo',
    services: ['SEO'],
  },
  {
    patterns: [/book|call|meet|schedule|consultation|talk|discuss|appointment/i],
    reply: "I'd love to connect you with our team! We offer a free 30-minute strategy call where we'll discuss your goals and put together a custom plan. You can book directly via email at editaura.ea@gmail.com — or I can have the team reach out to you. What works best?",
    intent: 'booking',
    services: [],
    bookingTriggered: true,
  },
  {
    patterns: [/brand|logo|identity|design|visual|color/i],
    reply: "A strong brand identity sets you apart from the competition. Our brand design packages range from ₹20,000 for a logo + basic guidelines to ₹80,000 for a complete brand kit. What stage is your business at — new brand or rebrand?",
    intent: 'branding',
    services: ['Brand Identity'],
  },
  {
    patterns: [/video|reel|edit|production|youtube|short/i],
    reply: "We produce and edit high-quality videos for brands — from product shoots to social media reels. Projects start from ₹10,000. What type of video content are you planning?",
    intent: 'video',
    services: ['Video Production'],
  },
];

function getScriptedReply(text) {
  for (const entry of SCRIPTED_RESPONSES) {
    if (entry.patterns.some(p => p.test(text))) {
      return entry;
    }
  }
  return {
    reply: "That's a great question! Edit Aura specialises in website development, AI automation, social media management, SEO, branding, and video production. Which of these areas are you most interested in exploring for your business?",
    intent: 'general',
    services: [],
  };
}

// ── Lead Extraction (lightweight, stateless) ──────────────────────────────────
function extractLeadUpdates(text) {
  const updates = {};

  const emailMatch = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) updates.email = emailMatch[0];

  const phoneMatch = text.match(/(?:\+91[\-\s]?)?[6-9]\d{9}|(?:\+\d{1,3}[\-\s]?)?\(?\d{3}\)?[\-\s]?\d{3}[\-\s]?\d{4}/);
  if (phoneMatch) updates.phone = phoneMatch[0];

  const budgetMatch = text.match(/(?:₹|rs\.?|inr|budget|around|about|upto?)\s*([\d,]+(?:\s*(?:k|lakh|lac|thousand|crore))?)/i);
  if (budgetMatch) updates.budget = budgetMatch[0];

  const nameMatch = text.match(/(?:my name is|i am|i'm|call me)\s+([A-Z][a-z]+(?: [A-Z][a-z]+)?)/i);
  if (nameMatch) updates.name = nameMatch[1];

  const companyMatch = text.match(/(?:company|business|startup|firm|agency|studio|brand|shop|store)\s+(?:is|called|named)?\s*([A-Z][A-Za-z\s&]+?)(?:\.|\,|$)/i);
  if (companyMatch) updates.company = companyMatch[1].trim();

  return updates;
}

// ── Intent Detection ──────────────────────────────────────────────────────────
function detectIntent(text) {
  if (/price|cost|how much|rate|package|₹/i.test(text)) return 'pricing';
  if (/book|schedule|call|meet|consultation/i.test(text)) return 'booking';
  if (/website|web|landing|ecommerce/i.test(text)) return 'website';
  if (/ai|automation|chatbot|bot|workflow/i.test(text)) return 'ai_automation';
  if (/social|instagram|facebook|content/i.test(text)) return 'social_media';
  if (/seo|search|google|ranking/i.test(text)) return 'seo';
  if (/brand|logo|identity|design/i.test(text)) return 'branding';
  if (/video|reel|edit|youtube/i.test(text)) return 'video';
  return 'general';
}

// ── Gemini Call ───────────────────────────────────────────────────────────────
async function callGemini(messages) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  // Build Gemini contents array
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const body = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 200,
      topP: 0.9,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000), // 8s timeout for serverless
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}

// ── Goal Completion ───────────────────────────────────────────────────────────
function calcGoalCompletion(leadProfile, intent) {
  let score = 0;
  const fields = ['name', 'email', 'phone', 'company', 'budget', 'timeline'];
  fields.forEach(f => { if (leadProfile?.[f]) score += 14; });
  if ((leadProfile?.services ?? []).length > 0) score += 8;
  if (intent === 'booking') score = Math.max(score, 80);
  return Math.min(100, score);
}

// ── Main Handler ──────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // CORS for browser requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages = [], text, leadProfile = {} } = req.body ?? {};

    // Validate and sanitize the new user message
    const safeText = sanitizeInput(text ?? messages.at(-1)?.content ?? '');
    if (!safeText) {
      return res.status(400).json({ error: 'Invalid or blocked message' });
    }

    // Detect intent and extract lead data from this message
    const intent = detectIntent(safeText);
    const leadUpdates = extractLeadUpdates(safeText);

    // Merge lead updates
    const updatedLead = { ...leadProfile, ...leadUpdates };

    // Filter to last 10 messages to keep tokens bounded
    const history = messages.slice(-10).filter(m => m.role && m.content);

    // Ensure user message is last
    const fullHistory = [
      ...history,
      { role: 'user', content: safeText },
    ];

    // Try Gemini first, fall back to scripted
    let reply;
    let bookingTriggered = false;
    let detectedServices = [];

    if (process.env.GEMINI_API_KEY) {
      try {
        const geminiReply = await callGemini(fullHistory);
        if (geminiReply && geminiReply.trim().length > 0) {
          reply = geminiReply.trim();
        }
      } catch (err) {
        console.error('Gemini error, falling back to scripted:', err.message);
      }
    }

    if (!reply) {
      const scripted = getScriptedReply(safeText);
      reply = scripted.reply;
      bookingTriggered = scripted.bookingTriggered ?? false;
      detectedServices = scripted.services ?? [];
    }

    // Check if reply triggers booking
    if (!bookingTriggered && /book|schedule|strategy call|free call/i.test(reply)) {
      bookingTriggered = true;
    }

    // Update services from intent
    if (intent !== 'general' && intent !== 'booking' && intent !== 'pricing') {
      const serviceMap = {
        website: 'Website Development',
        ai_automation: 'AI Automation',
        social_media: 'Social Media Management',
        seo: 'SEO',
        branding: 'Brand Identity',
        video: 'Video Production',
      };
      const detectedService = serviceMap[intent];
      if (detectedService && !updatedLead.services?.includes(detectedService)) {
        updatedLead.services = [...(updatedLead.services ?? []), detectedService];
      }
    }

    const goalCompletionPct = calcGoalCompletion(updatedLead, intent);

    return res.json({
      reply,
      intent,
      leadUpdates,
      updatedLead,
      goalCompletionPct,
      bookingTriggered,
      provider: process.env.GEMINI_API_KEY ? 'gemini' : 'scripted',
    });

  } catch (err) {
    console.error('message_handler_error', err);
    return res.status(500).json({
      error: 'Failed to process message',
      reply: "I'm having a moment — please try again or email us at editaura.ea@gmail.com",
    });
  }
}
