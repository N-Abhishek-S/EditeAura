
export default function FeaturedWork() {
  // Admin-friendly structure: Add real project objects here when ready
  const portfolioProjects = []; 

  return (
    <section id="work" className="bg-brand-black text-brand-white py-24 md:py-32 px-6 md:px-12 relative overflow-hidden border-b border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40 block mb-4">
            PROVEN RESULTS
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight text-white leading-none mb-6">
            Featured Work.
          </h2>
          <p className="text-brand-light-gray/60 font-light max-w-xl mx-auto">
            Verified project showcase will be added here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {portfolioProjects.length > 0 ? (
             portfolioProjects.map((project, index) => (
                <div key={index} className="border border-white/10 bg-brand-dark/20 p-6">
                  {/* Real project layout will map over project data */}
                  <h3 className="text-2xl font-display font-bold text-white">{project.title}</h3>
                </div>
             ))
          ) : (
            // Render 4 placeholder cards
            [...Array(4)].map((_, i) => (
              <div key={i} className="group border border-white/10 bg-brand-dark/20 transition-colors duration-300 p-6 flex flex-col">
                {/* Large image placeholder */}
                <div className="w-full aspect-[4/3] bg-white/5 flex items-center justify-center border border-white/5 mb-6 relative overflow-hidden">
                   <div className="w-12 h-12 border border-white/10 flex items-center justify-center rounded-full opacity-50">
                     <span className="text-xs font-mono text-white/40">IMG</span>
                   </div>
                </div>
                
                {/* Project title placeholder */}
                <h3 className="text-2xl font-display font-bold text-white mb-3">
                  Project Coming Soon
                </h3>
                
                {/* Short description placeholder */}
                <p className="text-sm text-brand-light-gray/60 font-light mb-6 flex-grow">
                  A comprehensive breakdown of the challenge, solution, and verifiable outcomes will be documented here once the project goes live.
                </p>
                
                {/* Technology stack placeholder */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {['Tech 1', 'Tech 2', 'Tech 3'].map((tech) => (
                    <span key={tech} className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-1 text-white/50 uppercase tracking-widest">
                      {tech}
                    </span>
                  ))}
                </div>
                
                {/* Future case study button */}
                <button disabled className="mt-auto w-full py-4 border border-white/10 text-xs font-bold tracking-widest uppercase text-white/30 bg-white/5 cursor-not-allowed">
                  Case Study Pending
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
