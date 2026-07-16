import { motion } from 'framer-motion';
import { User, Mail, Phone, Building, DollarSign, Clock, Package, CheckCircle2 } from 'lucide-react';

const FIELD_CONFIG = [
  { key: 'name',               icon: User,        label: 'Name' },
  { key: 'email',              icon: Mail,        label: 'Email' },
  { key: 'phone',              icon: Phone,       label: 'Phone' },
  { key: 'company',            icon: Building,    label: 'Company' },
  { key: 'budget',             icon: DollarSign,  label: 'Budget' },
  { key: 'timeline',           icon: Clock,       label: 'Timeline' },
  { key: 'services',           icon: Package,     label: 'Services' },
];

/**
 * LeadProgressPanel — side panel showing collected lead fields.
 * Each field animates in when captured. Completion bar tracks session goal.
 */
export default function LeadProgressPanel({ leadProfile = {}, confidence = {}, goalCompletionPct = 0 }) {
  const filledFields = FIELD_CONFIG.filter(f => {
    const v = leadProfile[f.key];
    return v && !(Array.isArray(v) && v.length === 0);
  });

  const totalFields = FIELD_CONFIG.length;
  const fieldCompletionPct = Math.round((filledFields.length / totalFields) * 100);

  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-widest text-white/40 uppercase">
          Lead Profile
        </span>
        <span className="text-xs font-bold text-violet-400">
          {goalCompletionPct}% qualified
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${goalCompletionPct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          aria-hidden="true"
        />
      </div>

      {/* Fields */}
      <div className="space-y-2">
        {FIELD_CONFIG.map(({ key, icon: Icon, label }) => {
          const value = leadProfile[key];
          const hasValue = value && !(Array.isArray(value) && value.length === 0);
          const conf = confidence[key];

          return (
            <motion.div
              key={key}
              className={`flex items-center gap-2.5 transition-all duration-300 ${
                hasValue ? 'opacity-100' : 'opacity-30'
              }`}
              animate={hasValue ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <div className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center ${
                hasValue ? 'bg-violet-500/20' : 'bg-white/5'
              }`}>
                <Icon size={11} className={hasValue ? 'text-violet-400' : 'text-white/30'} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-white/30 font-medium uppercase tracking-wide">{label}</div>
                {hasValue ? (
                  <div className="text-xs text-white/80 truncate font-medium">
                    {Array.isArray(value) ? value.join(', ') : value}
                  </div>
                ) : (
                  <div className="text-xs text-white/20">Not captured yet</div>
                )}
              </div>

              {hasValue && (
                <CheckCircle2 size={12} className="flex-shrink-0 text-emerald-400" aria-label={`${label} confirmed`} />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Intent tag */}
    </div>
  );
}
