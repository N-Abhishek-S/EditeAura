
export default function TrustStrip() {
  const metrics = [
    { value: '20+', label: 'Businesses Managed' },
    { value: '1L+', label: 'Reach Generated' },
    { value: '100%', label: 'Delivery Rate' },
  ];

  const brandTickers = [
    'TechVentures', 'Zenix Media', 'Sora Creative', 'Aether Corp', 
    'Aura Apparel', 'Vortex Digital', 'Nexus Automation', 'Prism Studio'
  ];

  return (
    <section className="bg-brand-white text-brand-black py-16 border-y border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left: Ticker Column */}
          <div className="lg:col-span-6 overflow-hidden relative w-full">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-neutral-400 block mb-6 text-left">
              Trusted by fast-growing businesses
            </span>
            
            {/* Infinite Horizontal Scroll Track */}
            <div className="flex w-full overflow-hidden mask-gradient-x select-none">
              <div className="flex gap-12 whitespace-nowrap animate-infinite-scroll">
                {[...brandTickers, ...brandTickers].map((brand, idx) => (
                  <span
                    key={idx}
                    className="text-xl md:text-2xl font-display font-black uppercase tracking-wider text-black/80 hover:text-black transition-colors cursor-default"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-3 gap-6 md:gap-12 border-t lg:border-t-0 lg:border-l border-neutral-200 pt-8 lg:pt-0 lg:pl-12">
            {metrics.map((metric, index) => (
              <div key={index} className="text-left">
                <h3 className="text-3xl md:text-5xl font-display font-black tracking-tight mb-2 text-black">
                  {metric.value}
                </h3>
                <p className="text-[10px] md:text-xs uppercase tracking-widest text-neutral-500 font-medium leading-relaxed">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
      
      {/* Inline styles for custom masking and animation overrides */}
      <style jsx="true">{`
        .mask-gradient-x {
          mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }
      `}</style>
    </section>
  );
}
