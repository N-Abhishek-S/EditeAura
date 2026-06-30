import React from 'react';
import { addons } from '../../data/pricingData';
import { Plus } from 'lucide-react';

export default function AddonGrid() {
  return (
    <div className="py-24 border-b border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-4">
            Add-On Services
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Enhance your packages with individual deliverables when you need that extra boost.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {addons.map((addon, idx) => (
            <div 
              key={idx} 
              className="group bg-[#0A0A0A] border border-[#222222] p-5 rounded-xl hover:border-[#C89B3C] hover:bg-[#111111] transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[140px]"
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium text-white/90 text-sm pr-4 group-hover:text-white transition-colors">{addon.title}</h4>
                <Plus size={16} className="text-[#C89B3C] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
              <div className="mt-auto">
                <div className="text-lg font-semibold text-white">
                  ₹{addon.price.toLocaleString('en-IN')}
                </div>
                {addon.unit === 'month' && (
                  <div className="text-[10px] uppercase tracking-widest text-white/40 font-medium">Per Month</div>
                )}
                {addon.unit === 'flat' && (
                  <div className="text-[10px] uppercase tracking-widest text-white/40 font-medium">Flat Fee</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
