import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Calendar } from 'lucide-react';

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
];

/**
 * BookingPanel — slide-up booking interface triggered by booking intent.
 * Currently uses mailto + calendar-style UI. Upgradeable to Calendly/Cal.com.
 */
export default function BookingPanel({ visible, onClose, leadProfile = {}, onBook }) {
  if (!visible) return null;

  const [selectedDate, setSelectedDate] = [null, () => {}]; // Simplified for now
  const today = new Date();

  const handleBook = (slot) => {
    const lead = leadProfile;
    const subject = `Strategy Call — ${lead.name ?? 'New Lead'}`;
    const body = `Hi Edit Aura Team,\n\nI'd like to book a strategy call.\n\nName: ${lead.name ?? 'N/A'}\nEmail: ${lead.email ?? 'N/A'}\nPhone: ${lead.phone ?? 'N/A'}\nCompany: ${lead.company ?? 'N/A'}\nInterested in: ${(lead.services ?? []).join(', ') || 'General enquiry'}\nBudget: ${lead.budget ?? 'N/A'}\nPreferred slot: ${slot}\n\nLooking forward to speaking with you!`;

    window.open(`mailto:editaura.ea@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    onBook?.({ slot });
    onClose?.();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="rounded-2xl border border-violet-500/20 bg-[#0d0d1a] p-5 space-y-4"
        role="dialog"
        aria-label="Book a strategy call"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-violet-400" aria-hidden />
            <span className="text-sm font-semibold text-white/90">Book a Strategy Call</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="Close booking panel"
          >
            <X size={13} className="text-white/50" />
          </button>
        </div>

        <p className="text-xs text-white/50 leading-relaxed">
          Choose a time that works for you. Our strategy sessions are 30 minutes and completely free.
        </p>

        {/* Time slots */}
        <div className="grid grid-cols-2 gap-2">
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot}
              onClick={() => handleBook(slot)}
              className="group px-3 py-2.5 text-xs font-medium rounded-xl border border-white/10 bg-white/3 text-white/70 hover:bg-violet-600/20 hover:border-violet-500/40 hover:text-white transition-all duration-200 text-center"
              aria-label={`Book slot at ${slot}`}
            >
              {slot}
            </button>
          ))}
        </div>

        <p className="text-[10px] text-white/25 text-center leading-relaxed">
          IST (India Standard Time) · Google Meet or Phone
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
