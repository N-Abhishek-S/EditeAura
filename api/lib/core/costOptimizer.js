/**
 * Cost Optimizer — serves FAQ/greeting responses without LLM calls.
 * Reduces Gemini costs by 30–40% on common conversational patterns.
 */

const FAQ_RESPONSES = [
  {
    patterns: [/\b(hello|hi|hey|good morning|good evening|good afternoon|namaste)\b/i],
    response: "Hello! I'm Aura, Edit Aura's AI Business Consultant. I help businesses with AI automation, websites, and digital growth. What brings you here today?",
  },
  {
    patterns: [/\b(thank(s| you)|great|perfect|awesome|wonderful|got it|okay|ok|alright|sure)\b/i, /^(👍|🙏|ok|k|okay|ty|thx)$/i],
    response: "You're welcome! Is there anything else I can help you with, or would you like to schedule a strategy call with our team?",
  },
  {
    patterns: [/\b(bye|goodbye|see you|take care|that's all|nothing else|i'm done|all done)\b/i],
    response: "Thank you for chatting with us! I'll make sure our team has your details. You can always reach us at editaura.ea@gmail.com. Have a great day!",
  },
  {
    patterns: [/\b(who are you|what are you|are you (an )?ai|are you (a )?bot|are you (a )?robot|are you human)\b/i],
    response: "I'm Aura — Edit Aura's AI Business Consultant. I'm powered by AI, but everything I share about our services and pricing is real. Is there something specific I can help you with today?",
  },
  {
    patterns: [/\b(where are you (based|located)|your (location|office|address)|where is edit aura)\b/i],
    response: "Edit Aura is a digital-first agency. Our team works remotely across India, which allows us to serve clients globally. We primarily work with businesses in India, the US, UAE, and UK. Where are you based?",
  },
];

const GREETING_THRESHOLD = 0.92;

/**
 * Check if message can be served from FAQ cache.
 * @param {string} text
 * @returns {{ hit: boolean, response?: string }}
 */
export function checkFAQCache(text) {
  const trimmed = text.trim();

  for (const faq of FAQ_RESPONSES) {
    const matched = faq.patterns.some(p => p.test(trimmed));
    if (matched) {
      return { hit: true, response: faq.response };
    }
  }

  return { hit: false };
}
