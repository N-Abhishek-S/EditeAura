import { Shield, Sparkles, Compass, Cpu, Target, Share2 } from 'lucide-react';

export default function Services() {
  const servicesList = [
    {
      num: '01',
      title: 'Social Media Management',
      icon: <Share2 size={24} />,
      platforms: ['Instagram Growth', 'LinkedIn Authority', 'Facebook Strategy'],
      description: 'Full-service handling of your social profiles with bespoke editorial content calendars designed to position you as an industry leader.',
      visual: (
        <div className="w-full h-32 bg-neutral-100 mb-6 flex items-end overflow-hidden relative">
          {/* Content Calendar Mockup */}
          <div className="absolute top-4 left-4 right-4 grid grid-cols-4 gap-2">
            <div className="h-12 bg-white border border-black/5 shadow-sm"></div>
            <div className="h-16 bg-brand-black border border-black/5 shadow-sm"></div>
            <div className="h-10 bg-white border border-black/5 shadow-sm"></div>
            <div className="h-14 bg-white border border-black/5 shadow-sm"></div>
          </div>
          <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-neutral-100 to-transparent"></div>
        </div>
      )
    },
    {
      num: '02',
      title: 'Content Creation',
      icon: <Sparkles size={24} />,
      platforms: ['High-Retention Reels', 'Creative Image Posts', 'Short-Form Video Edits'],
      description: 'Stop the scroll. We shoot, script, and edit high-caliber videos and static visuals that establish immediate attention.',
      visual: (
        <div className="w-full h-32 bg-brand-black mb-6 flex items-center justify-center overflow-hidden relative">
          {/* Editing Timeline Mockup */}
          <div className="w-full px-4 space-y-1">
            <div className="w-full h-3 bg-white/20 rounded flex overflow-hidden">
              <div className="w-1/3 bg-white border-r border-black/20"></div>
              <div className="w-1/4 bg-white/60 border-r border-black/20"></div>
            </div>
            <div className="w-3/4 h-2 bg-blue-500/50 rounded"></div>
            <div className="w-1/2 h-2 ml-4 bg-red-500/50 rounded"></div>
          </div>
          <div className="absolute left-1/3 top-0 bottom-0 w-[1px] bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)]"></div>
        </div>
      )
    },
    {
      num: '03',
      title: 'Branding & Systems',
      icon: <Compass size={24} />,
      platforms: ['Logo & Visual Design', 'Brand Guidelines', 'Typography Frameworks'],
      description: 'Give your business an elite identity. We build custom-tailored color stories, layouts, and typography systems that last.',
      visual: (
        <div className="w-full h-32 bg-neutral-100 mb-6 flex items-center justify-center overflow-hidden relative p-4 gap-2">
          {/* Brand Board Mockup */}
          <div className="w-1/2 h-full bg-brand-black text-white flex items-center justify-center text-[10px] font-display font-black tracking-widest">
            Aa
          </div>
          <div className="w-1/2 h-full flex flex-col gap-2">
            <div className="h-1/2 bg-neutral-300"></div>
            <div className="flex gap-2 h-1/2">
              <div className="w-1/2 bg-neutral-800"></div>
              <div className="w-1/2 bg-white border border-neutral-200"></div>
            </div>
          </div>
        </div>
      )
    },
    {
      num: '04',
      title: 'Website Development',
      icon: <Target size={24} />,
      platforms: ['High-Converting Landing Pages', 'Business Sites', 'Portfolio Showcases'],
      description: 'Clean code. Fluid layouts. Lightning-fast response times. Web designs built to make users pause and read.',
      visual: (
        <div className="w-full h-32 bg-brand-black mb-6 flex flex-col overflow-hidden relative border border-black/10">
          {/* Wireframe Mockup */}
          <div className="h-4 bg-white/10 w-full flex items-center px-2 gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
          </div>
          <div className="p-4 space-y-2 flex-1">
            <div className="w-1/2 h-4 bg-white/20"></div>
            <div className="w-3/4 h-2 bg-white/10"></div>
            <div className="w-1/4 h-6 bg-white border border-white/20 mt-4"></div>
          </div>
        </div>
      )
    },
    {
      num: '05',
      title: 'Business Automation',
      icon: <Cpu size={24} />,
      platforms: ['WhatsApp Pipelines', 'CRM Integration', 'Automated Lead Capture'],
      description: 'Save hours of manual follow-up. We build automated responses and WhatsApp databases that qualify leads while you sleep.',
      visual: (
        <div className="w-full h-32 bg-neutral-100 mb-6 flex items-center justify-center overflow-hidden relative">
          {/* Node graph mockup */}
          <div className="relative w-full h-full flex items-center justify-center">
             <div className="absolute w-full h-[1px] bg-black/10"></div>
             <div className="absolute w-[1px] h-full bg-black/10"></div>
             <div className="w-8 h-8 bg-black rounded z-10 flex items-center justify-center border-2 border-white shadow-lg">
                <Cpu size={12} className="text-white" />
             </div>
             <div className="absolute top-4 left-6 w-16 h-6 bg-white text-[8px] font-mono border border-black/10 flex items-center justify-center text-black/60 shadow-sm">Webhook</div>
             <div className="absolute bottom-4 right-6 w-16 h-6 bg-white text-[8px] font-mono border border-black/10 flex items-center justify-center text-black/60 shadow-sm">CRM Sync</div>
             {/* Connection line */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                <path d="M 40 20 Q 80 20, 150 80" stroke="black" strokeWidth="1" strokeDasharray="2 2" fill="none" opacity="0.2"/>
             </svg>
          </div>
        </div>
      )
    },
    {
      num: '06',
      title: 'Performance Marketing',
      icon: <Shield size={24} />,
      platforms: ['Meta Advertising', 'Lead Capture Campaigns', 'Hyper-Targeted Retargeting'],
      description: 'Maximize your ROI. High-performance media buying combined with premium attention-hooks that drive low cost-per-lead.',
      visual: (
        <div className="w-full h-32 bg-brand-black mb-6 flex items-end overflow-hidden relative p-4 gap-2">
          {/* Bar Chart Mockup */}
          <div className="w-full h-full flex items-end gap-2 border-b border-l border-white/20 pb-1 pl-1">
            <div className="w-1/6 h-[30%] bg-white/20"></div>
            <div className="w-1/6 h-[45%] bg-white/40"></div>
            <div className="w-1/6 h-[25%] bg-white/20"></div>
            <div className="w-1/6 h-[60%] bg-white/60"></div>
            <div className="w-1/6 h-[90%] bg-white border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.3)]"></div>
          </div>
        </div>
      )
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-neutral-200">
          {servicesList.map((service, index) => (
            <div
              key={index}
              className="border-r border-b border-neutral-200 p-8 md:p-10 flex flex-col justify-start group hover:bg-neutral-50 transition-colors duration-500 text-left min-h-[450px]"
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

              {/* Cinematic Mockup */}
              {service.visual}

              {/* Title & Description */}
              <h3 className="text-xl font-display font-bold text-black mb-4">
                {service.title}
              </h3>
              
              <p className="text-xs text-neutral-500 font-light leading-relaxed mb-6 flex-1">
                {service.description}
              </p>

              {/* Sub-services tags */}
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-neutral-100 mt-auto">
                {service.platforms.map((plat, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] uppercase tracking-wider bg-neutral-100 text-neutral-600 px-2 py-1 font-semibold"
                  >
                    {plat}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
