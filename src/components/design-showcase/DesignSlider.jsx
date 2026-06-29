import { useRef, useEffect, useState, useCallback } from 'react';
import { 
  motion, 
  useAnimationFrame, 
  useMotionValue, 
  useSpring, 
  useTransform, 
  wrap,
  useReducedMotion,
  useInView,
  animate
} from 'framer-motion';
import { designShowcase } from '../../data/designShowcase';
import DesignCard from './DesignCard';
import SliderControls from './SliderControls';
import SliderDots from './SliderDots'; // We keep it but it might be static or slowly animating

export default function DesignSlider() {
  const containerRef = useRef(null);
  const sliderRef = useRef(null);
  const inView = useInView(containerRef);
  const prefersReducedMotion = useReducedMotion();
  
  const [containerWidth, setContainerWidth] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(5);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  
  const interactionTimeoutRef = useRef(null);
  const totalOriginalSlides = designShowcase.length;
  
  // Create 4 sets of items to ensure enough content to wrap seamlessly
  const extendedItems = [...designShowcase, ...designShowcase, ...designShowcase, ...designShowcase];
  
  // Resize observer to get precise container width
  useEffect(() => {
    if (!containerRef.current) return;
    
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
        
        // Update cards per view based on new width
        const width = entry.contentRect.width;
        if (width < 640) setCardsPerView(1);
        else if (width < 768) setCardsPerView(1.2);
        else if (width < 1024) setCardsPerView(3);
        else if (width < 1280) setCardsPerView(4);
        else setCardsPerView(5);
      }
    });
    
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Geometric calculations
  const itemWidth = containerWidth > 0 ? containerWidth / cardsPerView : 0;
  const cycleWidth = itemWidth * totalOriginalSlides;
  
  // Physics Values
  const baseX = useMotionValue(0);
  const targetVelocity = -(cycleWidth / 25); // 25 seconds per cycle
  
  // Spring to smoothly interpolate velocity (handles hover stop/start perfectly)
  const velocity = useSpring(targetVelocity, { 
    damping: 50, 
    stiffness: 200,
    restDelta: 0.001
  });

  // Determine active velocity based on state
  useEffect(() => {
    if (prefersReducedMotion || isInteracting || !inView) {
      velocity.set(0);
    } else if (isHovered) {
      velocity.set(0);
    } else {
      velocity.set(targetVelocity);
    }
  }, [isHovered, isInteracting, prefersReducedMotion, inView, targetVelocity, velocity]);

  // Wrap the transform value so it infinitely loops back
  // By moving between 0 and -cycleWidth, it creates a flawless loop.
  // We offset the start by -cycleWidth so we have items to the left if the user drags backwards.
  const x = useTransform(baseX, (v) => {
    if (cycleWidth === 0) return '0px';
    const wrappedValue = wrap(-cycleWidth, 0, v);
    // Render starting from the second set to allow backward drag
    return `${wrappedValue - cycleWidth}px`; 
  });

  // --- Interaction Logic ---
  const isDragging = useRef(false);

  // The Animation Engine
  useAnimationFrame((t, delta) => {
    // Only apply velocity if we are not actively dragging
    if (isDragging.current) return;
    
    const currentVelocity = velocity.get();
    if (currentVelocity !== 0) {
      // delta is in ms, we want movement per second
      let moveBy = currentVelocity * (delta / 1000);
      baseX.set(baseX.get() + moveBy);
    }
  });

  const startInteraction = useCallback(() => {
    setIsInteracting(true);
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
  }, []);

  const endInteraction = useCallback(() => {
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
    // Resume after 3 seconds
    interactionTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 3000);
  }, []);

  const handleDragStart = () => {
    isDragging.current = true;
    startInteraction();
  };

  const handleDragEnd = () => {
    isDragging.current = false;
    endInteraction();
  };

  const bumpSlider = (direction) => {
    startInteraction();
    
    // Bump exactly one item width
    const currentX = baseX.get();
    const newX = direction === 'next' ? currentX - itemWidth : currentX + itemWidth;
    
    // Smoothly animate the bump
    animate(baseX, newX, {
      type: "spring",
      stiffness: 150,
      damping: 25,
      onComplete: endInteraction
    });
  };

  // Pagination Dot logic (approximate based on current position)
  const [activeIndex, setActiveIndex] = useState(0);
  
  useAnimationFrame(() => {
    if (cycleWidth === 0) return;
    // Calculate which item is currently closest to the left edge
    const currentX = -baseX.get();
    // Normalize to a positive distance within one cycle
    const normalizedDistance = ((currentX % cycleWidth) + cycleWidth) % cycleWidth;
    const index = Math.round(normalizedDistance / itemWidth) % totalOriginalSlides;
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  });

  const handleDotClick = (index) => {
    startInteraction();
    
    // Calculate distance to the target index
    const currentX = -baseX.get();
    const normalizedDistance = ((currentX % cycleWidth) + cycleWidth) % cycleWidth;
    const currentIndex = Math.round(normalizedDistance / itemWidth) % totalOriginalSlides;
    
    let diff = index - currentIndex;
    
    // Animate to new position
    const newX = baseX.get() - (diff * itemWidth);
    animate(baseX, newX, {
      type: "spring",
      stiffness: 150,
      damping: 25,
      onComplete: endInteraction
    });
  };

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
    };
  }, []);

  return (
    <div 
      className="relative w-full pb-12"
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden w-full relative group cursor-grab active:cursor-grabbing">
        <motion.div 
          ref={sliderRef}
          className="flex w-full will-change-transform"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -10000, right: 10000 }} // Arbitrary large numbers to allow infinite drag
          dragElastic={1}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {extendedItems.map((item, idx) => {
            return (
              <div 
                key={`${item.id}-${idx}`}
                className="flex-shrink-0 px-2 md:px-3 lg:px-4"
                style={{ width: `${itemWidth}px` }}
              >
                <div 
                  className="w-full pointer-events-none" 
                  style={{
                    aspectRatio: cardsPerView > 3 ? '320/520' : cardsPerView > 1.2 ? '280/460' : 'auto',
                    height: cardsPerView <= 1.2 ? '450px' : 'auto'
                  }}
                >
                  <DesignCard 
                    image={item.image} 
                    title={item.title} 
                  />
                </div>
              </div>
            );
          })}
        </motion.div>
        
        {/* Controls - Hidden on mobile, handled by swipe/drag */}
        <div className="hidden md:block">
          <SliderControls 
            onPrev={() => bumpSlider('prev')} 
            onNext={() => bumpSlider('next')} 
          />
        </div>
      </div>

      <SliderDots 
        total={totalOriginalSlides} 
        current={activeIndex} 
        onDotClick={handleDotClick} 
      />
    </div>
  );
}
