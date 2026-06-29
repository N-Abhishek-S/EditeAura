import { motion } from 'framer-motion';

export default function DesignCard({ image, title }) {
  return (
    <motion.div
      className="relative w-full h-full rounded-[20px] overflow-hidden bg-[#111] shadow-2xl border border-white/5 cursor-pointer group"
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ 
        boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)" 
      }}
    >
      {/* Purple Glow Effect on Hover */}
      <div className="absolute inset-0 bg-[#B794F4]/0 group-hover:bg-[#B794F4]/10 transition-colors duration-500 z-10 pointer-events-none" />
      
      {/* The Image */}
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      
      {/* Dark overlay at bottom for title (optional, based on design) */}
      {title && (
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <h3 className="text-white font-display font-bold text-lg tracking-wide">{title}</h3>
        </div>
      )}
    </motion.div>
  );
}
