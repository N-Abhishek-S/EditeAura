import React from 'react';
import { stats } from '../../data/pricingData';

export default function WhyEditAuraStats() {
  return (
    <div className="py-32 border-b border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-6">
          Why Partner With Edit Aura?
        </h2>
        <p className="text-lg text-white/50 mb-16 max-w-2xl mx-auto">
          We don't just deliver services; we build high-performing digital growth engines for ambitious brands.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center">
              <div className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-2 flex items-baseline">
                {stat.value}
                {stat.suffix && <span className="text-xl md:text-2xl text-[#C89B3C] ml-1">{stat.suffix}</span>}
              </div>
              <div className="text-sm md:text-base font-medium text-white/50 uppercase tracking-widest text-center max-w-[150px]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
