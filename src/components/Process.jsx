import { Compass, BarChart, Zap, Target } from 'lucide-react';

export default function Process() {
  const steps = [
    {
      num: '01',
      title: 'Discovery',
      icon: <Compass size={20} />,
      desc: 'We audit your current brand presence, identify leaks in your audience retention, and dissect competitor positioning. Guaranteed <2-hour response time on WhatsApp during business hours.'
    },
    {
      num: '02',
      title: 'Strategy',
      icon: <Target size={20} />,
      desc: 'We craft a custom visual tone of voice, storyboard high-stakes content pieces, and design automated routing pipelines. 2 rounds of structural revisions included standard.'
    },
    {
      num: '03',
      title: 'Execution',
      icon: <Zap size={20} />,
      desc: 'Our studio launches premium content, builds custom high-performance web components, and turns on WhatsApp lead automations. Clear milestone mapping—you always know what is being delivered next week.'
    },
    {
      num: '04',
      title: 'Growth',
      icon: <BarChart size={20} />,
      desc: 'We launch paid lead campaigns, track conversion stats, refine follow-up scripts, and scale organic reach loops.'
    }
  ];

  return (
    <section id="process" className="bg-brand-white text-brand-black py-24 md:py-32 px-6 md:px-12 relative border-b border-neutral-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-20 text-left">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-400 block mb-4">
            OUR BLUEPRINT
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight text-black leading-none">
            How We Execute.
          </h2>
          <p className="text-base text-neutral-500 max-w-lg mt-6 font-light">
            An end-to-end systematic process designed to transition businesses from invisible to authoritative.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {/* Connector Line (visible on desktop) */}
          <div className="hidden lg:block absolute top-[28px] left-[5%] right-[5%] h-[1px] bg-neutral-200 -z-10" />

          {steps.map((step, index) => (
            <div key={index} className="flex flex-col text-left group">
              
              {/* Step Marker Node */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-white border border-neutral-200 group-hover:border-black flex items-center justify-center transition-colors duration-500 relative">
                  <span className="absolute -top-2.5 -left-2.5 text-[10px] font-mono font-bold text-neutral-400 bg-white px-1">
                    {step.num}
                  </span>
                  <div className="text-neutral-400 group-hover:text-black transition-colors duration-500">
                    {step.icon}
                  </div>
                </div>
              </div>

              {/* Step Info */}
              <h3 className="text-xl font-display font-bold text-black mb-3 group-hover:translate-x-1 transition-transform duration-300">
                {step.title}
              </h3>
              
              <p className="text-xs text-neutral-500 leading-relaxed font-light">
                {step.desc}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
