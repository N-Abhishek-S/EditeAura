
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function SliderControls({ onPrev, onNext }) {
  return (
    <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-0 right-0 justify-between px-4 lg:px-8 pointer-events-none z-30">
      <button 
        onClick={onPrev}
        aria-label="Previous slide"
        className="pointer-events-auto w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#B794F4] hover:border-[#B794F4] transition-all duration-300 shadow-xl focus:outline-none focus:ring-2 focus:ring-[#B794F4]"
      >
        <ArrowLeft size={24} />
      </button>
      <button 
        onClick={onNext}
        aria-label="Next slide"
        className="pointer-events-auto w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#B794F4] hover:border-[#B794F4] transition-all duration-300 shadow-xl focus:outline-none focus:ring-2 focus:ring-[#B794F4]"
      >
        <ArrowRight size={24} />
      </button>
    </div>
  );
}
