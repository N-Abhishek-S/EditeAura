import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, MessageSquare } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function FinalCTA() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: 'Social Media Management',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formState.phone.trim() || !formState.company.trim()) {
       toast.error("Please fill in all fields.");
       return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      setIsSubmitted(true);
      toast.success(data.message || "Your enquiry has been sent successfully.");
      
      // Reset form
      setFormState({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: 'Social Media Management',
        message: ''
      });
      
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(error.message || "Unable to send your enquiry. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const services = [
    'Social Media Management',
    'Content Creation',
    'Branding & Visual Systems',
    'Website Development',
    'Business Automation',
    'Performance Marketing'
  ];

  return (
    <>
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            border: '1px solid #444'
          }
        }}
      />
      <section id="contact" className="bg-brand-black text-brand-white py-24 md:py-32 px-6 md:px-12 relative overflow-hidden">
      {/* Background visual detail */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Heading and Tagline */}
          <div className="lg:col-span-6 text-left">
            <span className="text-[10px] font-mono tracking-widest text-white/40 block mb-6">
              CONTACT // ENGAGEMENT PIPELINE
            </span>
            
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight text-white mb-6 uppercase leading-[0.95]">
              Ready To <br />
              Make Them <br />
              Pause?
            </h2>
            
            <p className="text-base md:text-lg text-brand-light-gray/60 max-w-md font-light leading-relaxed mb-10">
              Let’s build a brand people remember. Fill out the briefing form or skip the queue by reaching out directly on WhatsApp.
            </p>

            {/* Direct Connect Buttons */}
            <div className="flex flex-wrap gap-4">
              <a
                href="https://wa.me/#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 border border-white/20 hover:border-white text-white px-6 py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-300"
              >
                <MessageSquare size={16} /> Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Right Column: Premium Briefing Form */}
          <div className="lg:col-span-6 bg-brand-dark/40 border border-white/10 p-8 md:p-10 backdrop-blur relative">
            {/* Corner styling accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/35"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/35"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/35"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/35"></div>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-6"
              >
                <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mx-auto text-white">
                  <CheckCircle2 size={32} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-display font-bold text-white uppercase tracking-wider">
                    Pipeline Locked In
                  </h4>
                  <p className="text-xs text-brand-light-gray/50 max-w-xs mx-auto leading-relaxed font-light">
                    Your brief has been synced with our database. An automated callback schedule has been triggered.
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 p-3 max-w-xs mx-auto font-mono text-[9px] text-white/40">
                  STATUS: QUALIFIED // EXPECT REPLY &lt; 2HRS
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-white/40">
                      YOUR NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="Enter your name"
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white focus:bg-white/10 transition-colors"
                    />
                  </div>
  
                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-white/40">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="Enter your business email"
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white focus:bg-white/10 transition-colors"
                    />
                  </div>
  
                  {/* Phone */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-white/40">
                      PHONE NUMBER
                    </label>
                    <input
                      type="tel"
                      required
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      placeholder="Enter your phone number"
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white focus:bg-white/10 transition-colors"
                    />
                  </div>
  
                  {/* Company */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-white/40">
                      COMPANY NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.company}
                      onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                      placeholder="Enter your company name"
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white focus:bg-white/10 transition-colors"
                    />
                  </div>
                </div>

                {/* Service Selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-white/40">
                    REQUIRED CAPABILITY
                  </label>
                  <select
                    value={formState.service}
                    onChange={(e) => setFormState({ ...formState, service: e.target.value })}
                    className="w-full bg-brand-dark border border-white/10 px-4 py-3 text-xs text-white focus:outline-none focus:border-white transition-colors cursor-pointer appearance-none"
                    style={{
                      backgroundImage: 'url("data:image/svg+xml;utf8,<svg fill=\'white\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center',
                      backgroundSize: '16px'
                    }}
                  >
                    {services.map((svc) => (
                      <option key={svc} value={svc} className="bg-brand-black text-white">
                        {svc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brief Message */}
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-white/40">
                    PROJECT BRIEF
                  </label>
                  <textarea
                    rows="3"
                    required
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Tell us about your brand, challenge, and goals..."
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white focus:bg-white/10 transition-colors resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-3 bg-white text-black py-4 text-xs font-bold uppercase tracking-widest transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-neutral-200'}`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Transmit Project Brief <Send size={12} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
    </>
  );
}
