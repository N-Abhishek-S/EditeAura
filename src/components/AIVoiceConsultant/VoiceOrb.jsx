import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react';

/**
 * VoiceOrb — animated orb with 3 states: idle, listening, speaking, processing.
 * 60fps animations via Framer Motion. Respects prefers-reduced-motion.
 */
export default function VoiceOrb({ status = 'idle', onClick, size = 200 }) {
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const isListening = status === 'listening';
  const isSpeaking = status === 'speaking';
  const isProcessing = status === 'processing';
  const isActive = isListening || isSpeaking || isProcessing;

  const orbVariants = {
    idle: { scale: 1, transition: { duration: 0.4 } },
    listening: { scale: prefersReducedMotion ? 1 : 1.05, transition: { duration: 0.3 } },
    speaking: { scale: prefersReducedMotion ? 1 : 1.08, transition: { duration: 0.3 } },
    processing: { scale: 1, transition: { duration: 0.3 } },
  };

  const pulseVariants = {
    idle: {
      scale: prefersReducedMotion ? [1] : [1, 1.04, 1],
      opacity: prefersReducedMotion ? [0.15] : [0.15, 0.08, 0.15],
      transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
    },
    listening: {
      scale: prefersReducedMotion ? [1] : [1, 1.12, 1],
      opacity: prefersReducedMotion ? [0.25] : [0.25, 0.1, 0.25],
      transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
    },
    speaking: {
      scale: prefersReducedMotion ? [1] : [1, 1.18, 1],
      opacity: prefersReducedMotion ? [0.3] : [0.3, 0.08, 0.3],
      transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
    },
    processing: {
      scale: [1],
      opacity: [0.2],
      transition: { duration: 0.3 },
    },
  };

  const outerRingVariants = {
    idle: { scale: 1, opacity: 0.06 },
    listening: {
      scale: prefersReducedMotion ? [1] : [1, 1.25, 1],
      opacity: prefersReducedMotion ? [0.15] : [0.15, 0.04, 0.15],
      transition: { duration: 2, repeat: Infinity },
    },
    speaking: {
      scale: prefersReducedMotion ? [1] : [1, 1.35, 1],
      opacity: prefersReducedMotion ? [0.2] : [0.2, 0.03, 0.2],
      transition: { duration: 1.4, repeat: Infinity },
    },
    processing: { scale: 1, opacity: 0.08 },
  };

  const getGradient = () => {
    if (isListening) return 'from-emerald-500 via-teal-500 to-cyan-500';
    if (isSpeaking) return 'from-violet-500 via-purple-500 to-indigo-500';
    if (isProcessing) return 'from-blue-500 via-indigo-500 to-violet-500';
    return 'from-indigo-600 via-violet-600 to-purple-600';
  };

  const getIcon = () => {
    if (isProcessing) return <Loader2 size={size * 0.2} className="animate-spin text-white/80" />;
    if (isSpeaking) return <Volume2 size={size * 0.22} className="text-white/90" />;
    if (isListening) return <Mic size={size * 0.22} className="text-white animate-pulse" />;
    return <Mic size={size * 0.22} className="text-white/70" />;
  };

  const getStatusText = () => {
    if (isListening) return 'Listening...';
    if (isSpeaking) return 'Speaking...';
    if (isProcessing) return 'Thinking...';
    if (status === 'requesting_mic') return 'Allow microphone...';
    if (status === 'error') return 'Error';
    return 'Click to start';
  };

  return (
    <div
      className="relative flex flex-col items-center gap-4 cursor-pointer select-none"
      onClick={onClick}
      role="button"
      aria-label={`Voice assistant — ${getStatusText()}`}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}
    >
      {/* Outer ring — largest pulse */}
      <div className="relative" style={{ width: size * 1.6, height: size * 1.6 }}>
        <motion.div
          className="absolute inset-0 rounded-full border border-violet-500/20"
          animate={outerRingVariants[status] ?? outerRingVariants.idle}
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: size * 1.6, height: size * 1.6 }}
        />

        {/* Mid ring — secondary pulse */}
        <motion.div
          className="absolute rounded-full border border-purple-400/20"
          animate={isActive && !prefersReducedMotion ? {
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.05, 0.2],
            transition: { duration: 1.8, repeat: Infinity, delay: 0.3 },
          } : { scale: 1, opacity: 0.12 }}
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: size * 1.3, height: size * 1.3 }}
        />

        {/* Core orb */}
        <motion.div
          className="absolute rounded-full flex items-center justify-center overflow-hidden shadow-2xl"
          style={{
            top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: size, height: size,
          }}
          variants={orbVariants}
          animate={status}
          whileHover={!isActive && !prefersReducedMotion ? { scale: 1.03 } : {}}
        >
          {/* Gradient background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} transition-all duration-700`} />

          {/* Inner glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10" />

          {/* Processing spinner ring */}
          {isProcessing && !prefersReducedMotion && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-white/40"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            />
          )}

          {/* Speaking ripple rings */}
          <AnimatePresence>
            {isSpeaking && !prefersReducedMotion && [0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border border-white/20"
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1.6, opacity: 0 }}
                exit={{}}
                transition={{ duration: 1.5, delay: i * 0.4, repeat: Infinity, ease: 'easeOut' }}
              />
            ))}
          </AnimatePresence>

          {/* Center pulse (listening) */}
          {!prefersReducedMotion && (
            <motion.div
              className="absolute inset-4 rounded-full bg-white/10"
              animate={pulseVariants[status] ?? pulseVariants.idle}
            />
          )}

          {/* Icon */}
          <div className="relative z-10 flex items-center justify-center">
            {getIcon()}
          </div>
        </motion.div>
      </div>

      {/* Status label */}
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full transition-colors duration-300 ${
            isListening ? 'bg-emerald-400 animate-pulse' :
            isSpeaking ? 'bg-violet-400 animate-pulse' :
            isProcessing ? 'bg-blue-400' :
            'bg-white/20'
          }`}
          aria-hidden="true"
        />
        <span className="text-xs font-medium tracking-wide text-white/60 select-none">
          {getStatusText()}
        </span>
      </div>
    </div>
  );
}
