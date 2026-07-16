import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User } from 'lucide-react';

/**
 * ConversationTranscript — scrollable live transcript.
 * Each message animates in. Stays scrolled to bottom automatically.
 * Supports voice text, typing indicator, and error messages.
 */
export default function ConversationTranscript({ messages = [], isTyping = false, maxHeight = 400 }) {
  const bottomRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, isTyping]);

  if (!messages.length && !isTyping) return null;

  return (
    <div
      className="relative overflow-y-auto space-y-3 pr-1 scrollbar-thin"
      style={{ maxHeight }}
      role="log"
      aria-live="polite"
      aria-label="Conversation transcript"
    >
      <AnimatePresence initial={false}>
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div
              className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                msg.role === 'user'
                  ? 'bg-indigo-500/20 border border-indigo-500/30'
                  : 'bg-violet-500/20 border border-violet-500/30'
              }`}
              aria-hidden="true"
            >
              {msg.role === 'user'
                ? <User size={13} className="text-indigo-400" />
                : <Bot size={13} className="text-violet-400" />
              }
            </div>

            {/* Bubble */}
            <div
              className={`relative max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600/25 border border-indigo-500/20 text-white/90 rounded-tr-sm'
                  : msg.isError
                    ? 'bg-red-900/30 border border-red-500/30 text-red-300 rounded-tl-sm'
                    : 'bg-white/5 border border-white/8 text-white/85 rounded-tl-sm'
              }`}
            >
              {msg.content}

              {/* Timestamp */}
              <div className="mt-1 text-[10px] text-white/25">
                {new Date(msg.timestamp ?? Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            key="typing"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3"
          >
            <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-violet-500/20 border border-violet-500/30">
              <Bot size={13} className="text-violet-400" />
            </div>
            <div className="px-4 py-3 bg-white/5 border border-white/8 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1.5 items-center" aria-label="Aura is thinking">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-violet-400"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={bottomRef} />
    </div>
  );
}
