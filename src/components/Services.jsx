import { Shield, Sparkles, Compass, Cpu, Target, Share2 } from 'lucide-react';

export default function Services() {
  const servicesList = [
    {
      num: '01',
      title: 'Social Media Management',
      icon: <Share2 size={24} />,
      platforms: ['Instagram Growth', 'LinkedIn Authority', 'Facebook Strategy'],
      description: 'Full-service handling of your social profiles with bespoke editorial content calendars designed to position you as an industry leader.',
      image: '/assets/images/Social Media Management.png'
    },
    {
      num: '02',
      title: 'Content Creation',
      icon: <Sparkles size={24} />,
      platforms: ['High-Retention Reels', 'Creative Image Posts', 'Short-Form Video Edits'],
      description: 'Stop the scroll. We shoot, script, and edit high-caliber videos and static visuals that establish immediate attention.',
      image: '/assets/images/Content Creation.png'
    },
    {
      num: '03',
      title: 'Branding & Systems',
      icon: <Compass size={24} />,
      platforms: ['Logo & Visual Design', 'Brand Guidelines', 'Typography Frameworks'],
      description: 'Give your business an elite identity. We build custom-tailored color stories, layouts, and typography systems that last.',
      image: '/assets/images/Branding & Systems.png'
    },
    {
      num: '04',
      title: 'Website Development',
      icon: <Target size={24} />,
      platforms: ['High-Converting Landing Pages', 'Business Sites', 'Portfolio Showcases'],
      description: 'Clean code. Fluid layouts. Lightning-fast response times. Web designs built to make users pause and read.',
      image: '/assets/images/Web Development.png'
    },
    {
      num: '05',
      title: 'Business Automation',
      icon: <Cpu size={24} />,
      platforms: ['WhatsApp Pipelines', 'CRM Integration', 'Automated Lead Capture'],
      description: 'Save hours of manual follow-up. We build automated responses and WhatsApp databases that qualify leads while you sleep.',
      image: '/assets/images/Automation.png'
    },
    {
      num: '06',
      title: 'Performance Marketing',
      icon: <Shield size={24} />,
      platforms: ['Meta Advertising', 'Lead Capture Campaigns', 'Hyper-Targeted Retargeting'],
      description: 'Maximize your ROI. High-performance media buying combined with premium attention-hooks that drive low cost-per-lead.',
      image: '/assets/images/Performance Marketing.png'
    }
  ];

  return (
    <section id="services" className="bg-brand-white text-brand-black py-24 md:py-32 px-6 md:px-12 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-20 text-left">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-400 block mb-4">
            CORE CAPABILITIES
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight text-black leading-none">
            What We Master.
          </h2>
          <p className="text-base text-neutral-500 max-w-lg mt-6 font-light">
            We operate at the precise intersection of elite creative direction and rigorous technical systems. No generic templates. Just scalable growth architectures.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((service, index) => (
            <div
              key={index}
              className="glass-card p-8 md:p-10 flex flex-col justify-start group hover:bg-neutral-50/5 transition-colors duration-500 text-left min-h-[500px]"
            >
              {/* Header info */}
              <div className="flex justify-between items-start mb-6">
                <span className="text-xs font-mono tracking-widest text-neutral-400 font-bold">
                  {service.num}
                </span>
                <div className="text-black group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-2xl font-display font-bold text-black mb-4">
                {service.title}
              </h3>
              
              <p className="text-sm text-neutral-500 font-light leading-relaxed mb-6">
                {service.description}
              </p>

              {/* Sub-services tags */}
              <div className="flex flex-wrap gap-1.5 pb-6 mt-auto">
                {service.platforms.map((plat, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] uppercase tracking-wider bg-black/5 text-neutral-700 px-3 py-1.5 font-semibold rounded-full"
                  >
                    {plat}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-neutral-500 hover:border-neutral-500 transition-colors cursor-pointer">
                  Learn More
                </span>
              </div>

              {/* Cinematic Supporting Image */}
              <div className="w-full aspect-video rounded-[24px] overflow-hidden relative shadow-[0_25px_80px_rgba(0,0,0,0.25)]">
                <div className="absolute inset-0 img-overlay z-10 pointer-events-none"></div>
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover hover-scale-img"
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
