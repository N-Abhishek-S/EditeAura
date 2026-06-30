import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { servicesData } from '../data/pricingData';
import PricingToggle from '../components/pricing/PricingToggle';
import ServiceSection from '../components/pricing/ServiceSection';
import PackageBuilder from '../components/pricing/PackageBuilder';
import AddonGrid from '../components/pricing/AddonGrid';
import WhyEditAuraStats from '../components/pricing/WhyEditAuraStats';

export default function Packages() {
  // Generate JSON-LD Schema
  const getFaqSchema = () => {
    const mainEntity = servicesData.flatMap(service => 
      (service.faq || []).map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a
        }
      }))
    );
    
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": mainEntity
    };
  };

  const handleWhatsApp = (message = "Hi, I'd like to book a strategy call with Edit Aura.") => {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/919876543210?text=${encoded}`, '_blank');
  };

  return (
    <div className="bg-[#000000] min-h-screen font-sans selection:bg-[#C89B3C] selection:text-black">
      <Helmet>
        <title>Services & Pricing | Edit Aura</title>
        <meta name="description" content="Transparent, premium pricing for digital growth services. Website development, SEO, Social Media, and AI Automation packages for ambitious businesses." />
        <script type="application/ld+json">
          {JSON.stringify(getFaqSchema())}
        </script>
      </Helmet>

      {/* HERO SECTION */}
      <div className="pt-40 pb-24 px-4 md:px-6 border-b border-[#222222]">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-6"
          >
            Invest in <span className="text-white/50">Growth.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-2xl text-white/60 font-medium leading-relaxed max-w-3xl mx-auto mb-12"
          >
            Enterprise-grade digital infrastructure, without the enterprise overhead. Transparent pricing for ambitious brands.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={() => handleWhatsApp()}
              className="w-full sm:w-auto bg-white text-black px-8 py-4 rounded-lg font-medium hover:bg-neutral-200 transition-colors"
            >
              Book Strategy Call
            </button>
            <button 
              onClick={() => {
                document.getElementById('custom-builder').scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto bg-[#0A0A0A] border border-[#333333] text-white px-8 py-4 rounded-lg font-medium hover:bg-[#1A1A1A] transition-colors"
            >
              Build Custom Package
            </button>
          </motion.div>
        </div>
      </div>

      {/* WHY EDIT AURA */}
      <WhyEditAuraStats />

      {/* PRICING PLANS */}
      <div className="py-24" id="services">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <PricingToggle />
        </div>
        
        {servicesData.map(service => (
          <ServiceSection key={service.id} service={service} />
        ))}
      </div>

      {/* ADD-ONS */}
      <AddonGrid />

      {/* CUSTOM PACKAGE BUILDER */}
      <div id="custom-builder">
        <PackageBuilder />
      </div>

      {/* FINAL CTA */}
      <div className="py-32 px-4 md:px-6 bg-[#000000]">
        <div className="max-w-4xl mx-auto text-center border border-[#333333] bg-[#050505] rounded-3xl p-10 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#C89B3C]/50 to-transparent"></div>
          
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Ready to scale?
          </h2>
          <p className="text-lg text-white/60 font-medium mb-10 max-w-xl mx-auto">
            Stop losing customers to your competitors. Let's build a digital presence that actually generates revenue.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => handleWhatsApp("Hi! I'm ready to start growing my business with Edit Aura.")}
              className="w-full sm:w-auto bg-white text-black px-10 py-4 rounded-lg font-medium hover:bg-neutral-200 transition-colors"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </div>

      {/* STICKY MOBILE CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#050505] border-t border-[#222222] p-4 z-50 flex gap-3">
        <button 
          onClick={() => handleWhatsApp()}
          className="flex-1 bg-white text-black py-3 rounded-lg font-medium text-sm"
        >
          Book Call
        </button>
        <button 
          onClick={() => {
            document.getElementById('custom-builder').scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex-1 bg-[#1A1A1A] border border-[#333333] text-white py-3 rounded-lg font-medium text-sm"
        >
          Request Quote
        </button>
      </div>

    </div>
  );
}
