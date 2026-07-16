import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Star, Mail, Phone, Calendar, TrendingUp, ChevronRight } from 'lucide-react';

/**
 * ConversationSummaryModal — end-of-session modal with AI-generated summary.
 * Shows lead score, recommended services, follow-up actions.
 * Only rendered after endSession() completes with a summary.
 */
export default function ConversationSummaryModal({ summary, score, priority, onClose }) {
  if (!summary) return null;

  const priorityStyles = {
    hot:  { bg: 'from-red-900/30 to-orange-900/20', border: 'border-red-500/30', badge: 'bg-red-500/20 text-red-400 border-red-500/30', label: '🔥 Hot Lead' },
    warm: { bg: 'from-amber-900/20 to-yellow-900/10', border: 'border-amber-500/30', badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30', label: '🟡 Warm Lead' },
    cold: { bg: 'from-blue-900/20 to-indigo-900/10', border: 'border-blue-500/30', badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: '🔵 Cold Lead' },
  };

  const style = priorityStyles[priority ?? 'cold'];
  const likelihood = summary.likelihood ?? 50;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-label="Conversation summary"
      aria-modal="true"
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className={`relative w-full max-w-lg rounded-3xl border ${style.border} bg-gradient-to-br ${style.bg} bg-[#0a0a14] p-6 overflow-y-auto max-h-[90vh] shadow-2xl`}
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          aria-label="Close summary"
        >
          <X size={14} className="text-white/60" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <Star size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Conversation Complete</h2>
            <div className={`mt-0.5 text-xs font-semibold px-2 py-0.5 rounded-full border inline-block ${style.badge}`}>
              {style.label}
            </div>
          </div>
        </div>

        {/* Score */}
        <div className="mb-5 p-4 rounded-2xl bg-white/3 border border-white/5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-white/50 font-medium">Lead Score</span>
            <span className="text-2xl font-black text-white">{score}<span className="text-sm text-white/30 font-normal">/100</span></span>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-white/25">
            <span>Cold</span>
            <span>Likelihood: {likelihood}%</span>
            <span>Hot</span>
          </div>
        </div>

        {/* Summary fields */}
        <div className="space-y-3 mb-5">
          {[
            { label: 'Client', value: summary.clientName },
            { label: 'Company', value: summary.company },
            { label: 'Budget', value: summary.budgetRange },
            { label: 'Timeline', value: summary.timeline },
            { label: 'Requirements', value: summary.requirements },
            { label: 'Pain Points', value: summary.painPoints },
          ].filter(f => f.value && f.value !== 'Unknown' && f.value !== 'Not mentioned').map(({ label, value }) => (
            <div key={label} className="flex gap-3">
              <span className="text-[10px] text-white/35 font-semibold uppercase tracking-wide w-20 flex-shrink-0 pt-0.5">{label}</span>
              <span className="text-xs text-white/75 leading-relaxed flex-1">{value}</span>
            </div>
          ))}
        </div>

        {/* Recommended services */}
        {summary.recommendedServices?.length > 0 && (
          <div className="mb-5">
            <span className="text-[10px] text-white/35 font-semibold uppercase tracking-wide block mb-2">Recommended</span>
            <div className="flex flex-wrap gap-1.5">
              {summary.recommendedServices.map(s => (
                <span key={s} className="px-2.5 py-1 text-xs rounded-lg bg-violet-500/15 border border-violet-500/20 text-violet-300 font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Follow-up actions */}
        {summary.followUpActions?.length > 0 && (
          <div className="mb-5">
            <span className="text-[10px] text-white/35 font-semibold uppercase tracking-wide block mb-2">Follow-up Actions</span>
            <ul className="space-y-1.5">
              {summary.followUpActions.map((action, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-white/65">
                  <ChevronRight size={11} className="flex-shrink-0 mt-0.5 text-violet-400" />
                  {action}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA buttons */}
        <div className="flex gap-2 flex-wrap">
          <a
            href={`mailto:editaura.ea@gmail.com?subject=Follow up: ${encodeURIComponent(summary.clientName ?? 'Prospect')}&body=Hi! Following up on our AI conversation.`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors"
            aria-label="Send follow-up email"
          >
            <Mail size={12} /> Follow Up
          </a>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white/60 hover:bg-white/8 text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
