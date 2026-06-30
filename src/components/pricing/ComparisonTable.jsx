import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

export default function ComparisonTable({ comparisonData }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!comparisonData) return null;

  const { features, plans } = comparisonData;

  return (
    <div className="mt-16 border border-[#222222] rounded-2xl overflow-hidden bg-[#0A0A0A]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-[#111111] transition-colors md:cursor-default md:hover:bg-[#0A0A0A]"
      >
        <h4 className="text-lg font-medium text-white">Compare Plans</h4>
        <ChevronDown 
          size={20} 
          className={`text-white/50 transition-transform md:hidden ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <div className={`md:block ${isOpen ? 'block' : 'hidden'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px] border-t border-[#222222]">
            <thead>
              <tr className="border-b border-[#222222] bg-[#111111]/50">
                <th className="p-6 font-medium text-white/60 w-1/3">Feature</th>
                {plans.map((plan, idx) => (
                  <th key={idx} className="p-6 font-medium text-white/90 text-center">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, fIdx) => (
                <tr key={fIdx} className="border-b border-[#222222]/50 last:border-0 hover:bg-[#111111]/30 transition-colors">
                  <td className="p-6 text-[15px] text-white/80">{feature}</td>
                  {plans.map((plan, pIdx) => {
                    const value = plan.values[fIdx];
                    return (
                      <td key={pIdx} className="p-6 text-center text-[15px] text-white/70">
                        {value === '✓' ? (
                          <Check size={18} className="mx-auto text-[#C89B3C]" />
                        ) : (
                          value
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
