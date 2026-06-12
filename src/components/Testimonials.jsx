import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Star, Instagram, Linkedin } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      id: 1,
      quote: "Before working with EDIT AURA, our brand felt invisible. Their creative team completely redesigned our visuals and set up an automated WhatsApp funnel. In under two months, we closed more high-ticket deals than we did in the entire previous quarter. They truly make people pause.",
      author: "Marcus Thorne",
      title: "Managing Director",
      company: "The Vanguard Club",
      serviceUsed: "Branding & Automation",
      rating: 5,
      avatar: "MT",
      social: { platform: 'linkedin', url: 'https://linkedin.com/' }
    },
    {
      id: 2,
      quote: "Most marketing agencies speak in generic metrics and deliver average templates. EDIT AURA is different. They built a custom lead capture engine for our venture fund that automated 25 hours of manual founder vetting per week, while making our brand look incredibly premium.",
      author: "Elena Rostova",
      title: "General Partner",
      company: "Aether Capital",
      serviceUsed: "Web Dev & Performance",
      rating: 5,
      avatar: "ER",
      social: { platform: 'linkedin', url: 'https://linkedin.com/' }
    },
    {
      id: 3,
      quote: "Our Meta Ads budget was leaking cash. EDIT AURA rewrote our creative strategy and designed custom monochrome attention-hooks that immediately dropped our client acquisition costs. An elite creative studio with a deep understanding of business pipelines.",
      author: "Jared Vance",
      title: "VP of Growth",
      company: "Kora Tech",
      serviceUsed: "Content Creation",
      rating: 5,
      avatar: "JV",
      social: { platform: 'instagram', url: 'https://instagram.com/' }
    }
  ];

  const [index, setIndex] = useState(0);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const currentReview = reviews[index];

  return (
    <section className="bg-brand-black text-brand-white py-24 md:py-32 px-6 md:px-12 relative overflow-hidden border-b border-white/5">
      <div className="max-w-5xl mx-auto text-left relative z-10">
        
        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40 block mb-8">
          CLIENT VERDICT
        </span>

        {/* Large Slider quote block */}
        <div className="min-h-[320px] md:min-h-[260px] flex items-center mb-12 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_e, { offset }) => {
                const swipe = offset.x;
                if (swipe < -50) handleNext();
                else if (swipe > 50) handlePrev();
              }}
              className="space-y-8 w-full cursor-grab active:cursor-grabbing"
            >
              {/* Stars & Service Tag */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex gap-1">
                  {[...Array(currentReview.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-white text-white" />
                  ))}
                </div>
                <span className="text-[10px] uppercase tracking-widest text-white/50 border border-white/20 px-3 py-1">
                  {currentReview.serviceUsed}
                </span>
              </div>

              <blockquote className="text-xl md:text-3xl font-display font-light leading-relaxed text-brand-light-gray italic">
                "{currentReview.quote}"
              </blockquote>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Author Details and Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end pt-8 gap-6 relative">
          <div className="flex items-center gap-4">
            {/* Avatar Placeholder */}
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-lg font-bold border border-white/20">
              {currentReview.avatar}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-lg font-bold text-white flex items-center gap-2">
                {currentReview.author}
                {currentReview.social && (
                  <a href={currentReview.social.url} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                    {currentReview.social.platform === 'linkedin' ? <Linkedin size={14} /> : <Instagram size={14} />}
                  </a>
                )}
              </span>
              <span className="text-xs text-white/50 font-mono uppercase tracking-wider">
                {currentReview.title} <span className="text-white/20 mx-1">|</span> {currentReview.company}
              </span>
            </div>
          </div>

          <div className="flex gap-2 self-end md:self-auto w-full md:w-auto justify-end mt-4 md:mt-0">
            {/* Slider Navigation buttons */}
            <button
              onClick={handlePrev}
              className="p-4 border border-white/10 hover:border-white hover:bg-white/5 text-white transition-all rounded-none"
              aria-label="Previous testimonial"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              className="p-4 border border-white/10 hover:border-white hover:bg-white/5 text-white transition-all rounded-none"
              aria-label="Next testimonial"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
