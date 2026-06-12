import { Focus, Eye, Target } from 'lucide-react';

export default function About() {
  return (
    <section className="bg-brand-black text-brand-white py-24 md:py-32 px-6 md:px-12 relative overflow-hidden border-b border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Asymmetrical visual block */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative border border-white/10 p-6 md:p-8 bg-brand-dark/50 backdrop-blur">
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white"></div>

              <div className="mb-8">
                <span className="text-[10px] font-mono tracking-widest text-white/40 block mb-2">SYSTEM // ATTENTION_INDEX</span>
                <div className="h-[1px] bg-white/15 w-full"></div>
              </div>

              {/* Editorial Graphic mockup */}
              <div className="aspect-[4/3] bg-neutral-900 border border-white/5 relative overflow-hidden flex flex-col justify-between p-4 mb-6">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono text-white/50 flex items-center gap-1">
                    <Focus size={10} /> REC
                  </span>
                  <span className="text-[10px] font-mono text-white/50">1080P 60FPS</span>
                </div>
                
                {/* Center Reticle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <span className="text-[9px] font-mono text-white/40">SHUTTER: 1/120</span>
                  <span className="text-[9px] font-mono text-white/40">ISO: 400</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 border border-white/10 text-white mt-1">
                    <Eye size={16} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-white">High-Stakes Focus</h4>
                    <p className="text-xs text-white/50 mt-1 leading-relaxed">
                      We target exact audiences with hyper-refined visual pacing.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-2 border border-white/10 text-white mt-1">
                    <Target size={16} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-white">Lead Hook Systems</h4>
                    <p className="text-xs text-white/50 mt-1 leading-relaxed">
                      Automated funnels designed to convert eyeballs into pipeline.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Copywriting */}
          <div className="lg:col-span-7 order-1 lg:order-2 text-left">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-brand-gray block mb-4">
              ABOUT THE STUDIO
            </span>
            
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-white leading-tight mb-8">
              Attention Is The <br />
              Most Valuable Currency.
            </h2>
            
            <div className="space-y-6 text-brand-light-gray/70 font-light text-base md:text-lg leading-relaxed">
              <p>
                In a digital world saturated with noise, getting noticed is no longer about shouting louder. It’s about building authority that commands focus. Businesses today fail not because their products are poor, but because they are invisible.
              </p>
              <p className="font-semibold text-white">
                EDIT AURA designs custom marketing, content, and automation systems that make your target audience pause, pay attention, and act.
              </p>
              <p>
                We blend high-end editorial aesthetics with cutting-edge business intelligence. From cinematic short-form media to WhatsApp automation flows, we establish absolute market authority for your brand.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
