import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Packages() {
  const navigate = useNavigate();

  const handleNavClick = (target) => {
    if (window.location.hash !== '#/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const packages = [
    {
      name: 'Launch',
      description: 'For businesses establishing their online presence with high-quality foundational content.',
      price: 'Custom Quote',
      recommended: false,
      deliverables: [
        'Brand Identity Refresh',
        '8 High-Retention Reels/mo',
        'Basic Content Calendar',
        'Monthly Strategy Call',
        '1 Revision Round'
      ],
      buttonText: 'Start Your Launch',
    },
    {
      name: 'Scale',
      description: 'For businesses looking to grow reach, engagement, and conversion with a consistent pipeline.',
      price: 'Custom Quote',
      recommended: true,
      deliverables: [
        'Full Visual Architecture',
        '15 High-Retention Reels/mo',
        'Advanced Content Strategy',
        'Bi-weekly Strategy Calls',
        'Automated Lead Capture Setup',
        'Priority Editing & 2 Revisions'
      ],
      buttonText: 'Scale Your Brand',
    },
    {
      name: 'Dominate',
      description: 'For brands focused on aggressive content growth, authority, and complete market takeover.',
      price: 'Custom Quote',
      recommended: false,
      deliverables: [
        'Complete Rebranding & Guidelines',
        '30 High-Retention Reels/mo',
        'Daily Platform Management',
        'Weekly Strategy Sessions',
        'Full CRM & WhatsApp Pipeline',
        'Unlimited Revisions',
        'Dedicated Creative Director'
      ],
      buttonText: 'Dominate The Market',
    }
  ];

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 relative min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40 block mb-4">
            PARTNERSHIP MODELS
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight text-white leading-none mb-6">
            Outcome-Driven Growth.
          </h1>
          <p className="text-base text-brand-light-gray/70 font-light leading-relaxed">
            Tailored creative solutions designed to establish authority and scale your brand. We don't just edit videos; we build conversion systems.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-24">
          {packages.map((pkg, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={idx} 
              className={`relative border flex flex-col p-8 md:p-10 ${
                pkg.recommended ? 'border-white bg-white/5' : 'border-white/10 bg-brand-dark/30'
              }`}
            >
              {pkg.recommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black px-4 py-1 text-[9px] font-bold tracking-widest uppercase">
                  Recommended Path
                </div>
              )}
              
              <div className="mb-8 flex-1">
                <h3 className="text-3xl font-display font-black mb-3">{pkg.name}</h3>
                <p className="text-xs text-white/60 leading-relaxed font-light mb-6">
                  {pkg.description}
                </p>
                <div className="space-y-4">
                  {pkg.deliverables.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check size={14} className="text-white mt-0.5 shrink-0" />
                      <span className="text-sm font-light text-brand-light-gray">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => handleNavClick('contact')}
                className={`w-full flex items-center justify-center gap-2 py-4 text-xs font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                  pkg.recommended 
                    ? 'bg-white text-black hover:bg-neutral-200' 
                    : 'border border-white/20 text-white hover:border-white hover:bg-white/5'
                }`}
              >
                {pkg.buttonText}
                <ArrowRight size={14} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto border-t border-white/10 pt-20 text-left">
          <h2 className="text-2xl font-display font-bold mb-8">Frequent Inquiries</h2>
          <div className="space-y-4">
            {[
              { q: 'What is the standard turnaround time?', a: 'Initial concepts are delivered within 48-72 hours. Regular retainers operate on a structured weekly delivery schedule to ensure consistent posting.' },
              { q: 'Is there a minimum commitment?', a: 'We recommend a 3-month initial commitment to allow our systems and algorithms enough time to optimize and show clear ROI, but we offer rolling monthly agreements.' },
              { q: 'How do revisions work?', a: 'Depending on your package, we offer dedicated revision rounds. We use frame-accurate feedback tools to ensure adjustments are precise and fast.' }
            ].map((faq, i) => (
              <div key={i} className="border border-white/10 p-6 bg-white/[0.02]">
                <h4 className="text-sm font-bold text-white mb-2">{faq.q}</h4>
                <p className="text-xs text-white/60 font-light leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl md:text-5xl font-display font-black mb-8">Let's Build Something Extraordinary.</h2>
          <button onClick={() => handleNavClick('contact')} className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-brand-light transition-all cursor-pointer">
            Book Your Strategy Session
          </button>
        </div>
      </div>
    </div>
  );
}
