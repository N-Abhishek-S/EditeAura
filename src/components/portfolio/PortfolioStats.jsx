import  { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const StatCounter = ({ value, label, suffix = "+" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000; // 2 seconds
      const increment = value / (duration / 16); // 60fps
      
      const timer = setInterval(() => {
        start += increment;
        if (start > value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-6 border border-white/5 bg-brand-dark/20 backdrop-blur-sm">
      <div className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
        {count}{suffix}
      </div>
      <div className="text-xs font-mono text-white/50 uppercase tracking-widest text-center">
        {label}
      </div>
    </div>
  );
};

export default function PortfolioStats() {
  const stats = [
    { value: 200, label: "Projects Delivered" },
    { value: 100, label: "Happy Clients" },
    { value: 50, label: "Views Generated", suffix: "M+" },
    { value: 15, label: "Industries Served" }
  ];

  return (
    <section className="py-12 md:py-24 bg-brand-black relative z-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <StatCounter value={stat.value} label={stat.label} suffix={stat.suffix} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
