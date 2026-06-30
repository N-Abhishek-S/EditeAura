import React from 'react';

export default function PricingToggle() {
  return (
    <div className="flex items-center justify-center mb-16">
      <div className="bg-[#1A1A1A] border border-[#333333] p-1 rounded-full flex items-center shadow-inner relative overflow-hidden">
        <button 
          className="relative z-10 px-6 py-2.5 text-sm font-semibold rounded-full bg-white text-black transition-colors"
          disabled
        >
          Monthly
        </button>
        <button 
          className="relative z-10 px-6 py-2.5 text-sm font-medium text-white/50 cursor-not-allowed flex items-center gap-2 transition-colors"
          disabled
          aria-disabled="true"
          title="Yearly pricing coming soon"
        >
          Yearly
          <span className="bg-[#C89B3C]/20 text-[#C89B3C] border border-[#C89B3C]/30 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Coming Soon
          </span>
        </button>
      </div>
    </div>
  );
}
