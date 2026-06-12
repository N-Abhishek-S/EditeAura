import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, MessageSquare, Play, Grid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const floatingVariants = {
    animate1: {
      y: [0, -15, 0],
      rotate: [1, -2, 1],
      transition: { duration: 6, ease: 'easeInOut', repeat: Infinity },
    },
    animate2: {
      y: [0, 15, 0],
      rotate: [-1, 2, -1],
      transition: { duration: 7, ease: 'easeInOut', repeat: Infinity },
    },
    animate3: {
      y: [0, -10, 0],
      rotate: [0, 1.5, 0],
      transition: { duration: 5, ease: 'easeInOut', repeat: Infinity },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-black px-6 md:px-12 py-24 md:py-32">
      {/* Background Grid Lines (Architectural/Editorial style) */}
      <div className="absolute inset-0 grid grid-cols-4 pointer-events-none opacity-20">
        <div className="border-r border-white/5 h-full"></div>
        <div className="border-r border-white/5 h-full"></div>
        <div className="border-r border-white/5 h-full"></div>
        <div className="h-full"></div>
      </div>

      {/* Massive Background Tagline Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <h2 className="text-[12vw] font-display font-black uppercase tracking-[0.1em] text-white/[0.015] whitespace-nowrap leading-none">
          make them pause
        </h2>
      </div>

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* Left: Typographic Branding & Headlines */}
        <motion.div
          className="lg:col-span-7 flex flex-col items-start text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Subtle Tagline Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 border border-white/10 px-3 py-1 mb-8"
          >
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-brand-light-gray/60">
              make them pause
            </span>
          </motion.div>

          {/* Main Editorial Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-display font-bold tracking-tight text-white leading-[1.05] mb-6"
          >
            We Make Brands <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">
              Impossible To Ignore.
            </span>
          </motion.h1>

          {/* Editorial Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg text-brand-light-gray/60 max-w-xl font-light leading-relaxed mb-10"
          >
            We don't sell aesthetics; we engineer attention. By combining elite creative direction with automated sales pipelines, we transform passive viewers into qualified revenue.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
          >
            <button
              onClick={() => handleNavClick('contact')}
              className="flex items-center justify-center gap-3 bg-white text-black px-8 py-4 text-xs font-semibold uppercase tracking-widest hover:bg-brand-light transition-all duration-300 relative group cursor-pointer"
            >
              Book a Strategy Call
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => handleNavClick('work')}
              className="flex items-center justify-center gap-3 border border-white/20 text-white px-8 py-4 text-xs font-semibold uppercase tracking-widest hover:border-white hover:bg-white/5 transition-all duration-300 cursor-pointer"
            >
              View Our Work
            </button>
          </motion.div>
        </motion.div>

        {/* Right: Floating Mockups & Sample Displays */}
        <div className="lg:col-span-5 relative w-full h-[450px] sm:h-[550px] flex items-center justify-center mt-8 lg:mt-0">
          
          {/* Card 1: Content Reels/Short-form mock */}
          <motion.div
            variants={floatingVariants}
            animate="animate1"
            className="absolute top-12 left-4 md:left-8 w-60 sm:w-64 bg-brand-dark border border-white/10 p-4 shadow-2xl z-20 pointer-events-none"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[9px] font-bold">EA</div>
                <div>
                  <h4 className="text-[10px] font-semibold text-white">edit.aura</h4>
                  <p className="text-[8px] text-white/40">Active Strategy</p>
                </div>
              </div>
              <span className="text-[9px] text-white/40 uppercase tracking-widest font-mono">REEL</span>
            </div>
            
            <div className="relative aspect-[9/16] h-48 bg-neutral-900 overflow-hidden flex items-center justify-center mb-3">
              {/* Abstract video placeholder visual */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3 text-left">
                <p className="text-[10px] font-bold text-white leading-snug mb-1">
                  "Make them pause at first glance..."
                </p>
                <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                  <div className="bg-white w-2/3 h-full rounded-full"></div>
                </div>
              </div>
              <Play className="text-white opacity-40" size={32} />
            </div>

            <div className="flex items-center justify-between text-[9px] text-white/60">
              <span className="flex items-center gap-1 font-semibold text-white">
                <Sparkles size={10} /> 1.2M Views
              </span>
              <span>124K Likes</span>
            </div>
          </motion.div>

          {/* Card 2: WhatsApp Automation System Mock */}
          <motion.div
            variants={floatingVariants}
            animate="animate2"
            className="absolute bottom-16 right-4 md:right-8 w-56 sm:w-60 bg-brand-white border border-black/5 p-4 shadow-2xl z-30 text-black pointer-events-none"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-black/50">WhatsApp Automation</span>
            </div>
            
            <div className="space-y-2 text-left mb-3">
              <div className="bg-neutral-100 p-2 rounded-lg max-w-[85%] text-[9px] leading-relaxed">
                🚀 Hey! I saw your branding strategy case study. How can we get started?
              </div>
              <div className="bg-black text-white p-2 rounded-lg max-w-[85%] ml-auto text-[9px] leading-relaxed">
                Hey there! System automated a callback for you in 5 mins. What is your primary channel?
              </div>
              <div className="bg-neutral-100 p-2 rounded-lg max-w-[85%] text-[9px] leading-relaxed">
                We need reels content + automated lead follow-ups!
              </div>
            </div>

            <div className="border-t border-black/5 pt-2 flex items-center justify-between text-[9px] text-neutral-400 font-mono">
              <span>status: Lead Qualified</span>
              <MessageSquare size={12} className="text-black" />
            </div>
          </motion.div>

          {/* Card 3: Web Mock Grid layout */}
          <motion.div
            variants={floatingVariants}
            animate="animate3"
            className="absolute top-24 right-10 w-44 sm:w-48 bg-[#0a0a0a] border border-white/5 p-3 shadow-2xl z-10 pointer-events-none"
          >
            <div className="h-2 w-8 bg-white/20 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-10 bg-white/5 flex items-center justify-center">
                <Grid size={12} className="text-white/20" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-6 bg-white/5"></div>
                <div className="h-6 bg-white/5"></div>
              </div>
              <div className="h-4 bg-white/10"></div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
