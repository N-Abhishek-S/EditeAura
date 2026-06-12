import React from 'react';

export default function CaseStudy() {
  // Admin-friendly structure: Pass case study object as props later
  const caseStudyData = null;

  if (!caseStudyData) {
    return (
      <div className="w-full max-w-4xl mx-auto border border-white/10 bg-brand-dark/20 p-8 md:p-12 text-center my-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-6">
          <span className="text-white/40 font-mono text-xs">DOC</span>
        </div>
        <h3 className="text-2xl font-display font-bold text-white mb-4">Case study coming soon.</h3>
        <p className="text-sm text-brand-light-gray/60 font-light">
          A verified breakdown of the challenge, solution, technologies, and outcome will be published here.
        </p>
      </div>
    );
  }

  // Real Case Study Layout
  return (
    <article className="w-full max-w-4xl mx-auto text-left text-brand-white my-12 p-8 border border-white/10 bg-brand-dark/20">
      {/* Structure Ready for Future Content */}
      <section className="mb-12">
        <h3 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Challenge</h3>
        <p className="text-brand-light-gray/80 leading-relaxed font-light">{caseStudyData.challenge}</p>
      </section>
      
      <section className="mb-12">
        <h3 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Solution</h3>
        <p className="text-brand-light-gray/80 leading-relaxed font-light">{caseStudyData.solution}</p>
      </section>
      
      <section className="mb-12">
        <h3 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Technologies Used</h3>
        <div className="flex flex-wrap gap-2">
           {caseStudyData.technologies?.map(tech => (
             <span key={tech} className="text-xs font-mono bg-white/5 border border-white/10 px-3 py-1 text-white/70">
               {tech}
             </span>
           ))}
        </div>
      </section>
      
      <section className="mb-12">
        <h3 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Features</h3>
        <ul className="list-disc pl-5 text-brand-light-gray/80 font-light space-y-2">
           {caseStudyData.features?.map((feature, i) => <li key={i}>{feature}</li>)}
        </ul>
      </section>
      
      <section className="mb-12">
        <h3 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Screenshots</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           {caseStudyData.screenshots?.map((src, i) => (
             <img key={i} src={src} alt="Project Screenshot" className="w-full border border-white/10" />
           ))}
        </div>
      </section>
      
      <section>
        <h3 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Outcome</h3>
        <p className="text-brand-light-gray/80 leading-relaxed font-light">{caseStudyData.outcome}</p>
      </section>
    </article>
  );
}
