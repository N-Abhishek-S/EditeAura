
import { motion } from 'framer-motion';
import DesignSlider from './DesignSlider';

export default function DesignShowcase() {
  return (
    <section className="bg-brand-black py-24 md:py-32 relative overflow-hidden border-b border-white/5">
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16 md:mb-24 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#B794F4] block mb-4">
            DESIGN SHOWCASE
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black tracking-tight text-white leading-none mb-6">
            Creative Designs That Build Brands.
          </h2>
          <p className="text-white/60 font-light text-lg md:text-xl">
            A curated collection of premium social media creatives, branding systems, advertisements, and visual identities crafted to elevate businesses across industries.
          </p>
        </motion.div>

        {/* The Auto-playing Slider */}
        <DesignSlider />

      </div>
    </section>
  );
}
