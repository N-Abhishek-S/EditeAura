import { motion } from 'framer-motion';

const SUGGESTIONS = [
  { label: 'Website pricing?', intent: 'pricing' },
  { label: 'AI automation services', intent: 'ai_automation' },
  { label: 'Social media growth', intent: 'social_media' },
  { label: 'Book a strategy call', intent: 'booking' },
  { label: 'SEO services', intent: 'seo' },
  { label: 'View all packages', intent: 'pricing' },
];

/**
 * QuickSuggestions — pre-session or post-reply prompt chips.
 * Only shown when there are no messages or after assistant speaks.
 */
export default function QuickSuggestions({ onSelect, visible = true }) {
  if (!visible) return null;

  return (
    <motion.div
      className="flex flex-wrap gap-2"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.3 }}
    >
      {SUGGESTIONS.map((s) => (
        <motion.button
          key={s.label}
          className="px-3 py-1.5 text-xs font-medium rounded-full border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/90 hover:border-violet-500/40 transition-all duration-200 cursor-pointer"
          onClick={() => onSelect(s.label)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          aria-label={`Ask about: ${s.label}`}
        >
          {s.label}
        </motion.button>
      ))}
    </motion.div>
  );
}
