
import { motion } from 'framer-motion';

export default function SliderDots({ total, current, onDotClick }) {
  // Create an array of length `total`
  const dots = Array.from({ length: total }, (_, i) => i);

  return (
    <div className="flex justify-center items-center gap-3 mt-12 mb-4">
      {dots.map((dotIndex) => {
        const isActive = dotIndex === current;
        return (
          <button
            key={dotIndex}
            onClick={() => onDotClick(dotIndex)}
            aria-label={`Go to slide ${dotIndex + 1}`}
            className="group relative p-2 focus:outline-none"
          >
            <motion.div
              className={`h-2 rounded-full transition-colors duration-300 ${
                isActive ? 'bg-[#B794F4]' : 'bg-white/20 group-hover:bg-white/40'
              }`}
              animate={{
                width: isActive ? 24 : 8,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />
          </button>
        );
      })}
    </div>
  );
}
