import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import PricingCard from './PricingCard';
import ComparisonTable from './ComparisonTable';

export default function ServiceSection({ service }) {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <section id={service.id} className="py-24 border-b border-[#222222]/50 last:border-0 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="mb-16 md:mb-20 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-6">
            {service.title}
          </h2>
          <p className="text-lg md:text-xl text-white/60 font-medium leading-relaxed">
            {service.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {service.packages.map((pkg) => (
            <PricingCard key={pkg.id} packageData={pkg} />
          ))}
        </div>

        {service.comparison && (
          <ComparisonTable comparisonData={service.comparison} />
        )}

        {service.faq && service.faq.length > 0 && (
          <div className="mt-24 max-w-3xl">
            <h3 className="text-2xl font-medium text-white mb-8">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {service.faq.map((faq, i) => (
                <div key={i} className="border-b border-[#222222]">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left py-6 flex items-center justify-between font-medium text-[15px] md:text-base text-white/90 hover:text-white transition-colors"
                  >
                    <span className="pr-8">{faq.q}</span>
                    <ChevronDown className={`transform transition-transform shrink-0 text-[#C89B3C] ${openFaq === i ? 'rotate-180' : ''}`} size={18} />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: 'auto', opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 text-white/60 font-normal text-[15px] leading-relaxed">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
