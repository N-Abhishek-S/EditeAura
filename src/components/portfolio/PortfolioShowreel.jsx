import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function PortfolioShowreel({ onHoverPlay }) {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[70vh] md:h-[90vh] overflow-hidden bg-brand-black"
      onMouseEnter={() => onHoverPlay && onHoverPlay(true)}
      onMouseLeave={() => onHoverPlay && onHoverPlay(false)}
    >
      <motion.div 
        style={{ y, scale }}
        className="absolute inset-0 w-full h-full"
      >
        <video 
          className="w-full h-full object-cover opacity-80"
          autoPlay 
          muted 
          loop 
          playsInline
          poster="https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=1920"
        >
          <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-brand-black/50" />
      </motion.div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center flex-col z-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          <span className="text-[10px] md:text-xs font-mono tracking-[0.3em] uppercase text-white/70 block mb-6">
            Aura Edit Showreel '24
          </span>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-black text-white tracking-tighter uppercase drop-shadow-2xl">
            Selected Work
          </h2>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Explore</span>
        <div className="w-[1px] h-12 bg-white/20 overflow-hidden relative">
          <motion.div 
            className="w-full h-full bg-white absolute top-0"
            animate={{ y: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
}
