
export default function BehindTheScenes() {
  return (
    <section className="bg-brand-black text-brand-white py-24 md:py-32 px-6 md:px-12 relative overflow-hidden border-b border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="text-left max-w-2xl">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40 block mb-4">
              BEHIND THE SCENES
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white leading-tight mb-4">
              The Engine Room.
            </h2>
            <p className="text-base text-brand-light-gray/70 font-light leading-relaxed">
              See how creative concepts are transformed into high-performing content. No fluff, just raw execution and strategic editing.
            </p>
          </div>
        </div>

        {/* Cinematic Video Player Placeholder */}
        <div className="relative aspect-video w-full bg-[#0a0a0a] border border-white/10 overflow-hidden group">
          {/* TODO: Replace src with actual Gemini-generated BTS video URL or local path */}
          <video 
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
            autoPlay 
            muted 
            loop 
            playsInline
            preload="none"
            poster="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'><rect width='100%' height='100%' fill='%23111'/><text x='50%' y='50%' font-family='sans-serif' font-size='20' fill='%23666' text-anchor='middle'>BTS Video Loading...</text></svg>"
          >
            {/* Provide valid src when available */}
            {/* <source src="/assets/bts-video.mp4" type="video/mp4" /> */}
          </video>
          
          {/* Overlay elements for cinematic feel */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20 pointer-events-none"></div>
          
          {/* UI overlay */}
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-[10px] font-mono tracking-widest text-white uppercase font-bold">REC</span>
          </div>

          <div className="absolute bottom-6 left-6 text-left">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 mb-1 block">
              STUDIO SESSION
            </span>
            <h4 className="text-lg font-display font-bold text-white">
              Creative Production & Strategy
            </h4>
          </div>
        </div>
      </div>
    </section>
  );
}
