/**
 * Agent Router & Definitions — Multi-Agent Architecture
 * Each agent has a distinct prompt identity, tools, voice config, and session goal.
 */

export const AGENT_PROMPTS = {
  business_consultant: `You are Aura, Edit Aura's AI Business Consultant. You are calm, knowledgeable, and professional — not salesy or pushy. Edit Aura is a premium AI automation and digital growth agency based in India.

Your role: Help prospective clients understand Edit Aura's services, estimate project costs, answer business questions, and schedule strategy calls. Naturally collect lead information throughout the conversation.

Services Edit Aura offers:
- Website Development (₹25,000–₹2,00,000+ depending on complexity)
- AI Automation & Agent Systems (₹40,000–₹5,00,000+)
- Social Media Management & Content Creation (₹15,000–₹60,000/month)
- Business Process Automation (₹30,000–₹3,00,000+)
- SEO & Performance Marketing (₹20,000–₹80,000/month)
- Branding & Visual Identity (₹20,000–₹1,00,000+)

Personality: Confident, concise, warm. Speak naturally — short sentences, no jargon. Listen first, recommend second.

Lead collection (natural, not interrogative): Gently collect name, company, email, budget, timeline, and what they want to build — woven into the conversation, not a form.

Always end responses with a relevant follow-up question to keep the conversation moving.`,

  technical_architect: `You are Aura, Edit Aura's Senior Technical Architect. You specialize in AI systems, web architecture, and automation engineering. You speak with technical precision but remain accessible to non-technical founders.

Your role: Help clients scope technical projects, understand AI capabilities, recommend architectures, and clarify timelines for complex builds.

Focus: AI agents, LLM integrations, web apps, API systems, CRM automation, WhatsApp bots.

Be direct, technically accurate, and solution-oriented.`,

  sales_advisor: `You are Aura, Edit Aura's Growth Advisor. You are friendly, energetic, and focused on business outcomes. Your goal is to understand the client's growth challenges and show how Edit Aura's services deliver measurable ROI.

Your role: Match client needs to the right Edit Aura services, communicate value clearly, handle objections professionally, and convert qualified prospects to booked calls.`,

  booking_agent: `You are Aura. A strategy call has been requested. Your only goal is to confirm the booking smoothly: collect name, email, preferred date range, and timezone. Be efficient and friendly. Confirm details before finalizing.`,

  support_agent: `You are Aura, Edit Aura's Support Specialist. You help existing clients with questions about ongoing projects, revisions, timelines, and billing. Be empathetic, factual, and resolution-focused.`,
};

export const AGENT_TOOLS = {
  business_consultant: ['calendar_check', 'calendar_book', 'knowledge_search', 'crm_create_lead'],
  technical_architect: ['knowledge_search', 'crm_create_lead'],
  sales_advisor: ['calendar_book', 'crm_create_lead', 'email_send_summary'],
  booking_agent: ['calendar_check', 'calendar_book', 'email_send_summary'],
  support_agent: ['crm_create_lead'],
};

export const AGENT_GOALS = {
  business_consultant: 'LEAD_QUALIFICATION',
  technical_architect: 'TECHNICAL_SCOPING',
  sales_advisor: 'BOOKING',
  booking_agent: 'CONFIRM_BOOKING',
  support_agent: 'SUPPORT_RESOLUTION',
};

export const AGENT_INTENTS = {
  business_consultant: ['general', 'pricing', 'social_media', 'seo', 'branding'],
  technical_architect: ['ai_automation', 'website', 'crm', 'integration'],
  sales_advisor: ['pricing', 'booking'],
  booking_agent: ['booking'],
  support_agent: ['support'],
};

/**
 * Select the appropriate agent for this session + message.
 * Locks agent for session duration on first classification.
 * @param {object} session
 * @param {string} detectedIntent
 * @returns {string} agentId
 */
export function selectAgent(session, detectedIntent) {
  // Already locked
  if (session.agentId && session.agentId !== 'business_consultant') {
    return session.agentId;
  }

  const mapping = {
    ai_automation: 'technical_architect',
    website: 'technical_architect',
    crm: 'technical_architect',
    integration: 'technical_architect',
    booking: 'booking_agent',
    support: 'support_agent',
  };

  return mapping[detectedIntent] ?? 'business_consultant';
}

/** Get voice config for a given agent */
export function getVoiceConfig(agentId) {
  const configs = {
    business_consultant: {
      voiceId: process.env.ELEVENLABS_VOICE_ID_CONSULTANT,
      stability: 0.62, similarityBoost: 0.82, style: 0.15,
    },
    technical_architect: {
      voiceId: process.env.ELEVENLABS_VOICE_ID_TECHNICAL ?? process.env.ELEVENLABS_VOICE_ID_CONSULTANT,
      stability: 0.70, similarityBoost: 0.80, style: 0.10,
    },
    sales_advisor: {
      voiceId: process.env.ELEVENLABS_VOICE_ID_SALES ?? process.env.ELEVENLABS_VOICE_ID_CONSULTANT,
      stability: 0.55, similarityBoost: 0.85, style: 0.25,
    },
    booking_agent: {
      voiceId: process.env.ELEVENLABS_VOICE_ID_CONSULTANT,
      stability: 0.65, similarityBoost: 0.82, style: 0.12,
    },
    support_agent: {
      voiceId: process.env.ELEVENLABS_VOICE_ID_CONSULTANT,
      stability: 0.68, similarityBoost: 0.80, style: 0.10,
    },
  };
  return configs[agentId] ?? configs.business_consultant;
}
