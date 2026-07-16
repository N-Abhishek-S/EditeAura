import { LLMProvider } from '../../interfaces/LLMProvider.js';

/**
 * Scripted LLM Provider — Development / Zero-key Fallback
 * Handles common business questions with deterministic responses.
 * No API key required. Full conversation capable.
 */
export class ScriptedProvider extends LLMProvider {
  constructor() { super(null, 'scripted-v1'); }

  get name() { return 'scripted'; }
  isAvailable() { return true; } // Always available

  async complete(messages) {
    const lastUser = [...messages].reverse().find(m => m.role === 'user');
    const text = lastUser?.content?.toLowerCase() ?? '';
    const reply = this._respond(text);
    return { text: reply, toolCalls: [], usage: { input: 0, output: 0 } };
  }

  async *stream(messages) {
    const result = await this.complete(messages);
    // Simulate streaming by chunking words
    const words = result.text.split(' ');
    for (const word of words) {
      yield word + ' ';
      await new Promise(r => setTimeout(r, 30));
    }
  }

  async completeWithTools(toolResults) {
    return { text: 'I\'ve noted your request and will follow up shortly.', usage: {} };
  }

  _respond(text) {
    if (/hello|hi|hey|good morning|good evening/i.test(text)) {
      return "Hello! I'm Aura, Edit Aura's AI Business Consultant. I can help you with information about our services, pricing, timelines, or schedule a strategy call. What brings you here today?";
    }
    if (/price|cost|how much|budget|charge|fee/i.test(text)) {
      return "Great question. Our pricing varies by project scope. Website development starts from ₹25,000 for a professional business site. AI automation packages begin at ₹40,000. Social media management starts at ₹15,000 per month. Could you tell me more about what you're looking to build so I can give you a more accurate estimate?";
    }
    if (/website|web|landing page|e-commerce|ecommerce/i.test(text)) {
      return "We build everything from professional business websites to complex e-commerce platforms and AI-powered web applications. Our websites are fast, mobile-first, and built for conversions. What kind of website are you thinking about — business presence, online store, or something more custom?";
    }
    if (/ai|automation|agent|chatbot|workflow|bot/i.test(text)) {
      return "AI automation is one of our core specializations. We build custom AI agents, WhatsApp automation systems, lead qualification bots, CRM integrations, and end-to-end workflow automation. What process in your business would you like to automate first?";
    }
    if (/social|instagram|reels|content|video|marketing/i.test(text)) {
      return "Our social media team handles content strategy, Reels production, and growth management for Instagram, YouTube, and LinkedIn. We've grown several client accounts from zero to tens of thousands of engaged followers. What platform are you focused on?";
    }
    if (/book|schedule|call|meeting|appointment|consult/i.test(text)) {
      return "I'd love to set up a strategy call for you with our team. Could I get your name and email address so we can send you a calendar invite?";
    }
    if (/seo|ranking|google|search engine|organic/i.test(text)) {
      return "Our SEO services cover technical SEO, content strategy, local SEO, and long-term organic growth. We've helped clients achieve first-page rankings in competitive industries. Are you looking for local SEO or broader national/international reach?";
    }
    if (/timeline|how long|duration|when/i.test(text)) {
      return "Timelines depend on scope. A business website typically takes 2–4 weeks. An AI automation system takes 3–6 weeks. Social media results are usually visible within 4–8 weeks. What project are you planning?";
    }
    if (/thank|thanks|great|perfect|awesome/i.test(text)) {
      return "You're welcome! Is there anything else I can help you with, or would you like to schedule a call with our team to get started?";
    }
    return "That's a great question. To give you the most relevant answer, could you tell me a bit more about your business and what you're trying to achieve? I want to make sure I point you in the right direction.";
  }
}
