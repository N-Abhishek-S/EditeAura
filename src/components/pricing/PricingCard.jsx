import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';

export default function PricingCard({ packageData }) {
  const { name, price, unit, bestFor, features, cta, isPopular } = packageData;

  const handleWhatsApp = (message) => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/919876543210?text=${encodedMessage}`, '_blank');
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`relative flex flex-col p-8 md:p-10 rounded-[16px] transition-all duration-300 ${
        isPopular 
          ? 'bg-[#111111] border border-[#333333] shadow-[0_20px_40px_rgba(0,0,0,0.4)] z-10' 
          : 'bg-[#0A0A0A] border border-[#222222]'
      }`}
    >
      {isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#C89B3C] text-black px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(200,155,60,0.4)]">
          Most Popular
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-xl font-medium text-white mb-2">{name}</h3>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-4xl font-semibold text-white tracking-tight">
            {typeof price === 'number' ? `₹${price.toLocaleString('en-IN')}` : price}
          </span>
          <span className="text-sm font-medium text-white/50">{unit}</span>
        </div>
        <p className="text-sm text-white/60 font-medium">Best for {bestFor}</p>
      </div>

      <div className="flex-1 mb-8">
        <ul className="space-y-4">
          {features.map((feature, i) => {
            const isHeader = feature.includes("Choose Any");
            if (isHeader) {
              return (
                <li key={i} className="text-sm font-semibold text-white/90 pt-2 pb-1 border-b border-[#222]">
                  {feature}
                </li>
              );
            }
            return (
              <li key={i} className="flex items-start gap-3 text-[15px] text-white/70">
                <Check size={18} className="shrink-0 text-[#C89B3C] mt-0.5" />
                <span className="leading-snug">{feature}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <button
        onClick={() => handleWhatsApp(`Hi, I'm interested in the ${name} package.`)}
        className={`w-full py-4 px-6 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 group ${
          isPopular
            ? 'bg-white text-black hover:bg-neutral-200'
            : 'bg-[#1A1A1A] text-white border border-[#333333] hover:bg-[#2A2A2A] hover:border-[#444444]'
        }`}
      >
        {cta}
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
      </button>
    </motion.div>
  );
}
