import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PackagesPreview() {
  return (
    <section className="bg-brand-black text-brand-white py-24 md:py-32 px-6 md:px-12 relative border-b border-white/5 overflow-hidden">
      {/* Background graphic */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40 block mb-6">
          PARTNERSHIP MODELS
        </span>
        
        <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white leading-tight mb-8">
          Not just editors.<br className="hidden md:block"/> We are your growth partners.
        </h2>
        
        <p className="text-base text-brand-light-gray/70 font-light leading-relaxed mb-12 max-w-2xl mx-auto">
          Whether you are launching your brand's digital presence or scaling aggressively to dominate your market, we have engineered outcome-driven packages to fit your objective.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <Link 
            to="/packages" 
            className="group flex items-center gap-3 bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all duration-300"
          >
            Explore Packages
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
