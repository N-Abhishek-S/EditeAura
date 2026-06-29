import { Target, TrendingUp, Zap, Briefcase, Clock } from 'lucide-react';

export default function WhyUs() {
  const reasons = [
    {
      title: 'Strategy First Approach',
      description: 'We do not just edit videos blindly. We analyze your market, study your audience, and build a creative strategy designed specifically to capture and convert your target demographic.',
      icon: <Target size={24} />
    },
    {
      title: 'Performance Driven Editing',
      description: 'Every cut, transition, and color grade is placed with a psychological purpose. We optimize for high retention and watch time because we understand algorithms reward engagement.',
      icon: <TrendingUp size={24} />
    },
    {
      title: 'Content Built For Retention',
      description: 'Attention is the new currency. We design visual hooks and pacing that make it impossible for users to keep scrolling. We make them pause.',
      icon: <Zap size={24} />
    },
    {
      title: 'Business-Oriented Direction',
      description: 'Most agencies care about aesthetic over outcome. We care about both. Our creative direction is deeply integrated with your sales pipeline to drive real business growth.',
      icon: <Briefcase size={24} />
    },
    {
      title: 'Fast & Reliable Turnaround',
      description: 'Speed to market matters. We deliver high-caliber assets without the bloated agency wait times. Reliable, consistent, and always on schedule.',
      icon: <Clock size={24} />
    }
  ];

  return (
    <section id="why-us" className="bg-brand-white text-brand-black py-24 md:py-32 px-6 md:px-12 relative overflow-hidden border-t border-black/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="text-left max-w-2xl">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-400 block mb-4">
              THE EDIT AURA STANDARD
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight text-black leading-tight mb-6">
              Why We Are Different.
            </h2>
            <p className="text-base text-neutral-500 font-light leading-relaxed">
              We operate differently from traditional production agencies. Our approach is deeply rooted in human psychology, market positioning, and verifiable analytics.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 text-left pt-12 border-t border-neutral-200">
          {reasons.map((point, index) => (
            <div key={index} className="flex flex-col gap-6 group">
              <div className="w-12 h-12 bg-brand-black text-brand-white flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                {point.icon}
              </div>
              <div>
                <h4 className="text-lg font-display font-bold text-black mb-3">
                  {point.title}
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed font-light">
                  {point.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-8 border-t border-neutral-200 text-left">
          <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">
            RESULT // MAXIMUM ATTENTION, AUTOMATED LEAD CAPTURE, HIGH CONVERSION
          </span>
        </div>
      </div>
    </section>
  );
}
