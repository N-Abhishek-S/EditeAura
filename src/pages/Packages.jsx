import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, MessageCircle, AlertCircle, TrendingUp, ShieldCheck, Clock, CheckCircle2, ChevronDown } from 'lucide-react';

export default function Packages() {
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({ name: '', business: '', phone: '' });

  const handleWhatsApp = (message = 'Hi, I would like to know more about Edit Aura services.') => {
    // Replace with your actual WhatsApp link/number
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/919876543210?text=${encodedMessage}`, '_blank');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const msg = `Audit Request:\nName: ${formData.name}\nBusiness: ${formData.business}\nWhatsApp Number: ${formData.phone}`;
    handleWhatsApp(msg);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-32 pb-24 px-4 md:px-6 relative min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* LAUNCH PRICING BANNER (URGENCY) */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-brand-white/10 border border-brand-white/20 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between max-w-4xl mx-auto mb-16"
        >
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <AlertCircle className="text-white" size={24} />
            <div>
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">Special Launch Pricing</h3>
              <p className="text-xs text-white/70">Introductory prices available while we build our portfolio. Prices will increase soon.</p>
            </div>
          </div>
          <div className="bg-white text-black px-4 py-2 rounded font-bold text-sm shrink-0 whitespace-nowrap">
            Only 10 Slots Remaining
          </div>
        </motion.div>

        {/* HERO SECTION */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-black tracking-tight text-white leading-tight mb-6"
          >
            Digital Growth, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Made Affordable.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-base md:text-xl text-brand-light-gray/80 font-light leading-relaxed mb-10 max-w-3xl mx-auto"
          >
            Get agency-level social media management, websites, and AI automation without the massive overhead costs. Built specifically for local businesses and startups.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <button 
              onClick={() => scrollToSection('pricing')}
              className="w-full sm:w-auto bg-white text-black px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              View Pricing Packages
            </button>
            <button 
              onClick={() => handleWhatsApp("Hi! I'm interested in working with Edit Aura.")}
              className="w-full sm:w-auto bg-[#25D366] text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#1ebd5c] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
            </button>
          </motion.div>
        </div>

        {/* LEAD MAGNET: FREE DIGITAL GROWTH AUDIT */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-5xl mx-auto bg-gradient-to-br from-white/10 to-transparent border border-white/20 p-6 md:p-12 mb-32 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-3xl md:text-5xl font-display font-black mb-4">Get a Free Digital Growth Audit</h2>
              <p className="text-white/70 mb-6 text-base md:text-lg">Discover exactly what is limiting your online growth and receive actionable, no-nonsense recommendations.</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm font-light text-white/80"><CheckCircle2 size={16} className="text-white" /> Website conversion analysis</li>
                <li className="flex items-center gap-2 text-sm font-light text-white/80"><CheckCircle2 size={16} className="text-white" /> Social media profile review</li>
                <li className="flex items-center gap-2 text-sm font-light text-white/80"><CheckCircle2 size={16} className="text-white" /> Competitor benchmarking</li>
              </ul>
              <p className="text-xs text-white/50 uppercase tracking-widest font-bold">No obligation. No hidden charges.</p>
            </div>
            <div className="bg-black/40 p-6 md:p-8 border border-white/10">
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <input required type="text" placeholder="Your Name" className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white outline-none focus:border-white transition-colors" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                <input required type="text" placeholder="Business Name" className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white outline-none focus:border-white transition-colors" value={formData.business} onChange={(e) => setFormData({...formData, business: e.target.value})} />
                <input required type="tel" placeholder="WhatsApp Number" className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white outline-none focus:border-white transition-colors" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                <button type="submit" className="w-full bg-[#25D366] text-white font-bold uppercase tracking-widest text-sm p-4 hover:bg-[#1ebd5c] transition-colors flex items-center justify-center gap-2">
                  <MessageCircle size={18} />
                  Send Audit Request on WhatsApp
                </button>
              </form>
            </div>
          </div>
        </motion.div>

        {/* SOCIAL PROOF (REALISTIC) */}
        <div className="text-center mb-32 border-y border-white/10 py-12">
          <p className="text-xl md:text-2xl font-light text-white/80 max-w-2xl mx-auto italic">
            "Building our portfolio with ambitious businesses."
          </p>
        </div>

        {/* WHY BUSINESSES CHOOSE US (TRUST) */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-black mb-4">Why Businesses Choose Edit Aura</h2>
            <p className="text-white/70">We focus on real outcomes, transparent pricing, and removing the risk for small businesses.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Affordable Pricing', desc: 'We keep pricing accessible specifically for startups and local businesses.', icon: TrendingUp },
              { title: 'Transparent Communication', desc: 'No hidden charges or confusing long-term contracts. Ever.', icon: MessageCircle },
              { title: 'Dedicated Support', desc: 'We stay available throughout the project and beyond.', icon: ShieldCheck },
              { title: 'Human + AI Powered', desc: 'Combining creative intuition with AI automation for better, faster results.', icon: Clock }
            ].map((feature, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-8 backdrop-blur-md">
                <feature.icon size={28} className="mb-6 text-white" />
                <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                <p className="text-sm text-white/60 font-light leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RISK REVERSAL: WORKING WITH US IS SIMPLE */}
        <div className="mb-32 max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-display font-black mb-16">Working With Us Is Simple</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 relative">
            {/* Desktop connecting line */}
            <div className="hidden md:block absolute top-6 left-0 w-full h-[1px] bg-white/20 z-0"></div>
            
            {[
              { step: '1', title: 'Book Free Consultation' },
              { step: '2', title: 'Receive Custom Strategy' },
              { step: '3', title: 'Approve Proposal' },
              { step: '4', title: 'We Start Building' }
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-black border border-white flex items-center justify-center text-xl font-bold mb-6">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg">{item.title}</h3>
              </div>
            ))}
          </div>
          <div className="mt-16 inline-flex items-center gap-8 text-sm font-light text-white/60 uppercase tracking-widest flex-wrap justify-center">
            <span>No Complicated Contracts</span>
            <span>•</span>
            <span>No Hidden Fees</span>
            <span>•</span>
            <span>Transparent Communication</span>
          </div>
        </div>

        {/* PRICING SECTIONS */}
        <div id="pricing" className="space-y-32">
          
          {/* 1. SOCIAL MEDIA MANAGEMENT */}
          <div>
            <SectionHeader title="Grow Your Brand on Social Media" subtitle="Attract customers and build trust with professional management." />
            <div className="text-center mb-10">
              <span className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                Monthly Retainer Plans
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mb-16">
              <PricingCard 
                name="Starter Plan" price="₹1,999/mo" target="New Businesses"
                outcomes={['Establish Professional Presence', 'Save Hours of Time Weekly', 'Consistent Brand Activity']}
                features={['8 Professional Posts', 'Caption Writing', 'Basic Hashtag Research', 'Monthly Report', 'WhatsApp Support']}
                ctaText="Claim Launch Pricing"
                whatsappMsg="Hi, I'm interested in the Social Media Starter Plan (₹1,999/mo)."
              />
              <PricingCard 
                name="Growth Plan" price="₹3,999/mo" target="Businesses looking for reach" highlight={true}
                outcomes={['Higher Engagement Rates', 'Reach New Local Customers', 'Build Brand Authority']}
                features={['12 Posts & Stories', 'Advanced Hashtags', 'Competitor Monitoring', 'Monthly Analytics', 'Priority Support']}
                ctaText="Discuss My Requirements"
                whatsappMsg="Hi, I'm interested in the Social Media Growth Plan (₹3,999/mo)."
              />
              <PricingCard 
                name="Business Plan" price="₹5,999/mo" target="Aggressive continuous growth"
                outcomes={['Maximum Market Visibility', 'Viral Growth Potential (Reels)', 'Strategic Content Pipeline']}
                features={['16 Posts & 4 Reels', 'Stories Included', 'Competitor Analysis', 'Content Planning', 'Priority Support']}
                ctaText="Chat About This Plan"
                whatsappMsg="Hi, I'm interested in the Social Media Business Plan (₹5,999/mo)."
              />
            </div>
          </div>

          {/* 2. WEBSITE DEVELOPMENT */}
          <div>
            <SectionHeader title="Websites That Convert Visitors" subtitle="Modern, fast-loading websites designed to generate leads." />
            <div className="text-center mb-10">
              <span className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                One-Time Project Cost
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mb-16">
              <PricingCard 
                name="Landing Page" price="Starts at ₹2,999" target="Campaigns & Personal Brands"
                outcomes={['Capture Leads Instantly', 'Mobile-Perfect Experience', 'Direct WhatsApp Routing']}
                features={['Responsive Design', 'WhatsApp Integration', 'Contact Form', 'Fast Loading', 'Basic SEO']}
                ctaText="Claim Launch Pricing"
                whatsappMsg="Hi, I'm interested in the Landing Page Website Plan."
              />
              <PricingCard 
                name="Business Website" price="Starts at ₹6,999" target="Local Businesses & Clinics" highlight={true}
                outcomes={['Build Instant Credibility', 'Rank Higher Locally', 'Generate Organic Inquiries']}
                features={['4–6 Pages', 'Responsive Design', 'Contact Forms', 'SEO Setup', 'Google Maps Integration']}
                ctaText="Discuss My Requirements"
                whatsappMsg="Hi, I'm interested in the Business Website Plan."
              />
              <PricingCard 
                name="Premium Website" price="Starts at ₹12,999" target="Established Service Brands"
                outcomes={['Dominant Industry Authority', 'Automated Lead Generation', 'Premium Aesthetic Feel']}
                features={['Custom UI Design', 'Advanced Animations', 'Blog Setup', 'SEO Optimization', 'Lead Generation System']}
                ctaText="Chat About This Plan"
                whatsappMsg="Hi, I'm interested in the Premium Website Plan."
              />
            </div>
          </div>

          {/* 3. AI AUTOMATION */}
          <div>
            <SectionHeader title="Save Time With AI Automation" subtitle="Eliminate repetitive tasks and focus entirely on your business." />
            <div className="text-center mb-10">
              <span className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                One-Time Setup Cost
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mb-16">
              <PricingCard 
                name="Basic Automation" price="Starts at ₹2,999" target="Solopreneurs"
                outcomes={['Never Miss a WhatsApp Lead', 'Organized Customer Data', 'Zero Manual Entry']}
                features={['WhatsApp Auto Replies', 'Lead Collection', 'Google Sheets Automation']}
                ctaText="Claim Launch Pricing"
                whatsappMsg="Hi, I'm interested in Basic AI Automation."
              />
              <PricingCard 
                name="Business Automation" price="Starts at ₹7,999" target="Growing Teams" highlight={true}
                outcomes={['Faster Sales Cycles', 'Automated Customer Nurturing', 'Streamlined Workflows']}
                features={['CRM Integration', 'Automated Follow-Ups', 'Email Workflows', 'Lead Tracking']}
                ctaText="Discuss My Requirements"
                whatsappMsg="Hi, I'm interested in Business AI Automation."
              />
              <PricingCard 
                name="Advanced Solutions" price="Starts at ₹14,999" target="High Volume Operations"
                outcomes={['24/7 Customer Support', 'Frictionless Booking', 'Massive Time Savings']}
                features={['AI Chatbot', 'Appointment Booking', 'Customer Support Automation', 'Custom Workflows']}
                ctaText="Chat About This Plan"
                whatsappMsg="Hi, I'm interested in Advanced AI Solutions."
              />
            </div>
          </div>

          {/* CUSTOM RECOMMENDATION SECTION */}
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-white/10 to-transparent border border-white/20 p-8 md:p-12 text-center rounded-xl my-24">
            <h3 className="text-2xl md:text-4xl font-display font-black mb-4">Not Sure Which Package Is Right For You?</h3>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto text-lg">
              Every business is different. Tell us about your goals and we will recommend the most effective solution for your budget.
            </p>
            <button 
              onClick={() => handleWhatsApp("Hi! I'm not sure which package I need. Can I get a custom recommendation?")}
              className="inline-flex bg-[#25D366] text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#1ebd5c] transition-all cursor-pointer items-center justify-center gap-2"
            >
              <MessageCircle size={18} />
              Get My Custom Recommendation
            </button>
          </div>
        </div>

        {/* COMPARISON TABLE: WHY EDIT AURA */}
        <div className="mb-32">
          <SectionHeader title="Why Edit Aura?" subtitle="See how we stack up against alternatives." />
          <div className="max-w-5xl mx-auto overflow-x-auto border border-white/10 bg-white/5 rounded-lg">
            <table className="w-full text-left text-sm md:text-base min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10 bg-black/40">
                  <th className="p-6 font-bold text-white w-2/5">Feature</th>
                  <th className="p-6 font-black text-white bg-white/5">Edit Aura</th>
                  <th className="p-6 font-bold text-white/50">Freelancer</th>
                  <th className="p-6 font-bold text-white/50">Traditional Agency</th>
                </tr>
              </thead>
              <tbody className="text-white/80">
                {[
                  { feature: 'Website Development', ea: '✓', fl: '✓', ta: '✓' },
                  { feature: 'Social Media Management', ea: '✓', fl: 'Sometimes', ta: '✓' },
                  { feature: 'AI Automation', ea: '✓', fl: 'Rarely', ta: 'Extra Cost' },
                  { feature: 'Affordable Pricing', ea: '✓', fl: '✓', ta: '✗ (Expensive)' },
                  { feature: 'Dedicated Support', ea: '✓', fl: 'Depends', ta: 'Depends' },
                  { feature: 'Custom Solutions', ea: '✓', fl: 'Depends', ta: 'Extra Cost' },
                  { feature: 'Fast Communication', ea: '✓', fl: 'Depends', ta: 'Often Slow' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="p-6 text-white">{row.feature}</td>
                    <td className="p-6 text-brand-white font-bold bg-white/5">{row.ea}</td>
                    <td className="p-6 text-white/50">{row.fl}</td>
                    <td className="p-6 text-white/50">{row.ta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ SECTION */}
        <div className="max-w-3xl mx-auto mb-32">
          <SectionHeader title="Frequently Asked Questions" subtitle="Addressing your concerns." />
          <div className="space-y-4">
            {[
              { q: 'Who creates the content for social media?', a: 'We work with both client-provided content and content created specifically for your business. During onboarding, we discuss the best content workflow based on your industry, location, and goals.' },
              { q: 'Why are your prices lower?', a: 'Many agencies charge ₹15k–₹50k because of high overhead and large offices. We use efficient workflows and AI tools to reduce our internal costs, passing the savings directly to you while maintaining premium quality.' },
              { q: 'Can I customize a package?', a: 'Yes! Every business is different. If you need a mix of social media, web, and AI features not listed in standard packages, we will create a custom quote for you.' },
              { q: 'How soon can we start?', a: 'Once you approve the strategy and proposal, we typically begin work within 24-48 hours.' },
              { q: 'Will I own my website after completion?', a: '100%. Once full payment is made, you own the website, domain (if purchased by us on your behalf), and all related assets. No holding your brand hostage.' },
              { q: 'Can I cancel my social media plan?', a: 'Yes, our monthly retainers can be cancelled with a simple 30-day notice. We don’t force you into restrictive yearly lock-ins.' },
              { q: 'Do you provide support after project delivery?', a: 'Absolutely. We offer ongoing maintenance packages, and all projects include a standard post-launch bug-fix period.' },
              { q: 'Can you build custom AI automation?', a: 'Yes, we specialize in mapping out your unique business bottlenecks and creating custom AI workflows, chatbots, and CRM integrations to solve them.' },
              { q: 'How does the free consultation work?', a: 'We get on a quick 15-30 minute call or WhatsApp chat to understand your goals. Then, we provide a no-obligation strategy on how we can help.' }
            ].map((faq, i) => (
              <div key={i} className="border border-white/10 bg-white/5 overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left p-5 md:p-6 flex items-center justify-between font-bold text-sm md:text-base hover:bg-white/5 transition-colors"
                >
                  {faq.q}
                  <ChevronDown className={`transform transition-transform shrink-0 ${openFaq === i ? 'rotate-180' : ''}`} size={16} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="px-5 md:px-6 pb-6 text-white/60 font-light text-sm leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* FINAL CTA SECTION */}
        <div className="text-center py-24 border-t border-white/10 relative overflow-hidden bg-white/5 rounded-2xl">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-white/10 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 px-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6">Ready To Scale Your Business?</h2>
            <p className="text-white/70 mb-10 max-w-xl mx-auto text-lg">
              Stop losing customers to your competitors. Let's build a digital presence that actually generates revenue.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => scrollToSection('pricing')}
                className="w-full sm:w-auto bg-white text-black px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all cursor-pointer"
              >
                View Packages
              </button>
              <button 
                onClick={() => handleWhatsApp("Hi! I'm ready to start growing my business with Edit Aura.")}
                className="w-full sm:w-auto bg-[#25D366] text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#1ebd5c] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                Chat on WhatsApp
              </button>
            </div>
            <p className="mt-6 text-xs text-white/50 uppercase tracking-widest">Takes 2 minutes. No obligations.</p>
          </div>
        </div>

      </div>

      {/* STICKY WHATSAPP CTA FOR MOBILE/DESKTOP */}
      <button 
        onClick={() => handleWhatsApp("Hi Edit Aura! I need help growing my business.")}
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} />
      </button>

    </div>
  );
}

// Helper Components
const SectionHeader = ({ title, subtitle }) => (
  <div className="text-center mb-12">
    <h2 className="text-3xl md:text-5xl font-display font-black mb-4">{title}</h2>
    <p className="text-white/70 max-w-2xl mx-auto">{subtitle}</p>
  </div>
);

const PricingCard = ({ name, price, target, outcomes, features, ctaText, whatsappMsg, highlight }) => {
  return (
    <div className={`relative flex flex-col p-6 md:p-8 transition-all duration-300 ${
      highlight ? 'border-2 border-white bg-white/5' : 'border border-white/10 bg-black/20 hover:bg-white/5'
    }`}>
      {highlight && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black px-4 py-1 text-[10px] font-bold tracking-widest uppercase whitespace-nowrap">
          Most Popular
        </div>
      )}
      
      <div className="mb-6 flex-1">
        <h3 className="text-xl md:text-2xl font-display font-black mb-2">{name}</h3>
        <div className="text-2xl md:text-3xl font-display font-bold text-white mb-2">{price}</div>
        <p className="text-xs text-white/50 uppercase tracking-widest mb-6">Best For: {target}</p>
        
        {/* OUTCOMES SECTION (CRO Improvement) */}
        <div className="mb-6 bg-white/5 p-4 border border-white/5">
          <p className="text-xs font-bold uppercase tracking-wider text-white mb-3">What You Achieve:</p>
          <ul className="space-y-2">
            {outcomes.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-white/90 font-medium">
                <TrendingUp size={14} className="mt-0.5 shrink-0 text-[#25D366]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* DELIVERABLES SECTION */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3">Deliverables:</p>
          <ul className="space-y-3">
            {features.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-white/70 font-light">
                <Check size={14} className="mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-3 mt-auto pt-6 border-t border-white/10">
        <button 
          onClick={() => {
            const encodedMessage = encodeURIComponent(whatsappMsg);
            window.open(`https://wa.me/919876543210?text=${encodedMessage}`, '_blank');
          }}
          className={`w-full flex items-center justify-center gap-2 py-4 text-xs font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer ${
            highlight ? 'bg-white text-black hover:bg-neutral-200' : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <MessageCircle size={16} />
          {ctaText}
        </button>
      </div>
    </div>
  );
};
