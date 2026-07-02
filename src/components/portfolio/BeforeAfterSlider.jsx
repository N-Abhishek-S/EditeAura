import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

export default function BeforeAfterSlider({ beforeImage, afterImage, beforeLabel = "Before", afterLabel = "After" }) {
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef(null);
  const sliderX = useMotionValue(50); // percentage 0-100
  const [ setContainerWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
    
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePointerMove = (e) => {
    if (!isResizing || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    // Convert to percentage and clamp between 0 and 100
    let percentage = (x / rect.width) * 100;
    percentage = Math.max(0, Math.min(100, percentage));
    
    sliderX.set(percentage);
  };

  const clipPathValue = useTransform(sliderX, (value) => `inset(0 ${100 - value}% 0 0)`);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video select-none touch-none overflow-hidden rounded-lg group cursor-ew-resize"
      onPointerDown={() => setIsResizing(true)}
      onPointerUp={() => setIsResizing(false)}
      onPointerLeave={() => setIsResizing(false)}
      onPointerMove={handlePointerMove}
    >
      {/* After Image (Background) */}
      <div className="absolute inset-0">
        <img src={afterImage} alt="After" className="w-full h-full object-cover pointer-events-none" />
      </div>

      {/* Before Image (Foreground, Clipped) */}
      <motion.div 
        className="absolute inset-0"
        style={{ clipPath: clipPathValue }}
      >
        <img src={beforeImage} alt="Before" className="w-full h-full object-cover pointer-events-none" />
      </motion.div>

      {/* Slider Line & Handle */}
      <motion.div
        className="absolute top-0 bottom-0 w-0.5 bg-white flex items-center justify-center z-10"
        style={{ left: useTransform(sliderX, v => `${v}%`), x: '-50%' }}
      >
        <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center -ml-[1px]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
            <path d="M9 18l6-6-6-6" transform="translate(6, 0)" opacity="0.3" />
            <path d="M15 6l6 6-6 6" transform="translate(-6, 0)" opacity="0.3" />
          </svg>
        </div>
      </motion.div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-white pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        {beforeLabel}
      </div>
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-white pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        {afterLabel}
      </div>
    </div>
  );
}
