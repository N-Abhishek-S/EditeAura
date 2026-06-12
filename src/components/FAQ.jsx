import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

export default function FAQ() {
  const faqs = [
    {
      q: "Who creates the content for social media?",
      a: "We work with both client-provided content and content created specifically for your business. During onboarding, we discuss the best content workflow based on your industry, location, and goals."
    },
    {
      q: "What exactly is a creative growth partner?",
      a: "Unlike standard marketing agencies that focus purely on ad metrics or simple content management, EDIT AURA handles the entire attention-to-revenue funnel. We craft premium creative visual assets (social media, video editing, branding) and link them directly to technical business backends (high-performance web apps, WhatsApp automated pipelines, CRM logging)."
    },
    {
      q: "How does WhatsApp Automation help my pipeline?",
      a: "When a lead interacts with your Reels or submits an ad form, they are standardly left waiting. Our automation initiates a dynamic WhatsApp follow-up in under 30 seconds. The system asks qualification questions, syncs responses directly to your Hubspot or Notion database, and delivers a Cal.com link to lock in a booked call. Total human overhead is reduced to zero."
    },
    {
      q: "Do you handle custom software and web development?",
      a: "Yes. We build bespoke landing pages, enterprise portfolios, and multi-channel applications using clean frameworks (React, Vite, Node). Our web design philosophy focuses on fast load speeds, massive whitespace, and high conversion structures."
    },
    {
      q: "What is your typical execution timeline?",
      a: "Our discovery and visual framework phase takes 7-10 days. Content production and automated pipelines launch within 14-21 days of onboarding. Once live, optimization loops run weekly."
    },
    {
      q: "What are your communication and revision guarantees?",
      a: "We guarantee a <2-hour response time on WhatsApp during standard business hours. All our strategic projects include 2 rounds of structural revisions as a standard, and we provide clear milestone mapping so you always know what is being delivered each week."
    },
    {
      q: "How do we get started?",
      a: "Book a Strategy Call using our main CTA. We will run a 15-minute audit of your current channels, isolate where your leads are leaking, and outline a custom visual + automation plan."
    }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="bg-brand-black text-brand-white py-24 md:py-32 px-6 md:px-12 relative overflow-hidden border-b border-white/5">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-16 text-center">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40 block mb-4">
            CLARITY // SYSTEM INFO
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-white">
            Frequently Asked.
          </h2>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-white/10 bg-brand-dark/20 backdrop-blur transition-all duration-300 hover:border-white/30"
              >
                {/* FAQ Header toggle button */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm md:text-base font-display font-bold text-white tracking-wide">
                    {faq.q}
                  </span>
                  <div className="text-white ml-4 flex-shrink-0">
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>

                {/* FAQ Content transition */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-xs md:text-sm text-brand-light-gray/70 leading-relaxed font-light border-t border-white/5 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
