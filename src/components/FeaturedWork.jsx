import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Sparkles, TrendingUp, Cpu, CheckCircle } from 'lucide-react';

export default function FeaturedWork() {
  const processSteps = [
    'Brief',
    'Strategy',
    'Concept',
    'Script',
    'Production',
    'Editing',
    'Delivery'
  ];

  const projects = [
    {
      id: 1,
      name: 'The Vanguard Club',
      industry: 'Luxury Lifestyle Brand',
      clientGoal: 'Translate high-net-worth value online and lower CAC.',
      strategy: 'Implement a bold monochrome visual layout to differentiate from standard luxury tropes.',
      execution: 'Scripted and produced 12 high-retention cinematic short-form Reels capturing elite brand values.',
      results: 'Organic engagement grew exponentially, lowering acquisition cost by 45%.',
      icon: <Sparkles className="text-white" size={24} />,
      metrics: ['1.4M Reach', '340% Engagement', '-45% CAC'],
      bgPattern: 'bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]'
    },
    {
      id: 2,
      name: 'Aether Capital',
      industry: 'Fintech & Venture Firm',
      clientGoal: 'Attract startup founders and automate the vetting pipeline.',
      strategy: 'Design an authoritative, typography-first landing page tied to an automated CRM.',
      execution: 'Built a WhatsApp lead pipeline connecting directly to their internal databases for instant founder qualification.',
      results: 'WhatsApp automation system saved 25+ hours of manual follow-up weekly.',
      icon: <Cpu className="text-white" size={24} />,
      metrics: ['820+ Applications', '25+ Hrs Saved/Wk', '100% Automate'],
      bgPattern: 'bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] [background-size:24px_24px]'
    },
    {
      id: 3,
      name: 'Kora Tech',
      industry: 'AI Developer Platform',
      clientGoal: 'Decrease high cost-per-lead on Meta Ads.',
      strategy: 'Construct a hyper-targeted Meta Retargeting sequence using stark contrast ad sets.',
      execution: 'Deployed premium creative hooks that stood out against standard SaaS ad graphics on feeds.',
      results: 'Customer acquisition cost reduced to an all-time low, massively improving ROAS.',
      icon: <TrendingUp className="text-white" size={24} />,
      metrics: ['6.4x ROAS', '$12 Lead Cost', '+190% CTR'],
      bgPattern: 'bg-[linear-gradient(45deg,#ffffff05_25%,transparent_25%,transparent_75%,#ffffff05_75%,#ffffff05),linear-gradient(45deg,#ffffff05_25%,transparent_25%,transparent_75%,#ffffff05_75%,#ffffff05)] [background-size:30px_30px] [background-position:0_0,15px_15px]'
    }
  ];

  const [activeProject, setActiveProject] = useState(projects[0]);

  return (
    <section id="work" className="bg-brand-black text-brand-white py-24 md:py-32 px-6 md:px-12 relative overflow-hidden border-b border-white/5">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="text-left">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40 block mb-4">
              PROVEN RESULTS
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight text-white leading-none">
              Featured Work.
            </h2>
          </div>
        </div>

        {/* Idea Generation -> Visualization Journey */}
        <div className="mb-20 border border-white/10 bg-white/[0.02] p-8 md:p-12 text-left">
          <h3 className="text-xl font-display font-bold mb-8">Idea Generation → Visualization Journey</h3>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2 z-0"></div>
            {processSteps.map((step, idx) => (
              <div key={idx} className="flex md:flex-col items-center gap-4 md:gap-3 relative z-10 bg-[#121212] md:bg-transparent py-2 md:py-0 w-full md:w-auto">
                <div className="w-8 h-8 rounded-full border border-white/20 bg-brand-black flex items-center justify-center text-white/60">
                  {idx === processSteps.length - 1 ? <CheckCircle size={14} className="text-white" /> : <span className="text-[10px] font-mono">{idx + 1}</span>}
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-white/60">
                  {step}
                </span>
                {idx !== processSteps.length - 1 && (
                  <div className="md:hidden w-[1px] h-6 bg-white/10 absolute left-4 top-10"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Showcase Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Project List / Sidebar selectors */}
          <div className="lg:col-span-4 flex flex-col justify-start gap-4">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => setActiveProject(project)}
                className={`w-full text-left p-6 border transition-all duration-300 relative group flex justify-between items-center ${
                  activeProject.id === project.id
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent border-white/10 hover:border-white/40 text-white'
                }`}
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase tracking-widest opacity-60 font-mono">
                    {project.industry}
                  </span>
                  <span className="text-lg font-display font-bold">
                    {project.name}
                  </span>
                </div>
                <ArrowUpRight
                  size={18}
                  className={`transition-transform duration-300 ${
                    activeProject.id === project.id ? 'translate-x-0.5 -translate-y-0.5' : 'opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Project Details Panel */}
          <div className="lg:col-span-8 border border-white/10 bg-brand-dark/30 backdrop-blur relative overflow-hidden flex flex-col min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="p-8 md:p-12 flex flex-col justify-between flex-1 relative z-10"
              >
                
                {/* Top content */}
                <div>
                  <div className="flex justify-between items-center mb-10">
                    <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                      {activeProject.industry}
                    </span>
                    <div className="p-3 bg-white/5 border border-white/10">
                      {activeProject.icon}
                    </div>
                  </div>

                  <h3 className="text-2xl md:text-4xl font-display font-bold text-white tracking-tight mb-8 text-left">
                    {activeProject.name}
                  </h3>

                  {/* Comprehensive Case Study Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left border-t border-white/5 pt-8 mb-8">
                    <div>
                      <h4 className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/40 mb-2">
                        CLIENT GOAL
                      </h4>
                      <p className="text-xs text-brand-light-gray/70 leading-relaxed font-light mb-6">
                        {activeProject.clientGoal}
                      </p>

                      <h4 className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/40 mb-2">
                        STRATEGY
                      </h4>
                      <p className="text-xs text-brand-light-gray/70 leading-relaxed font-light">
                        {activeProject.strategy}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/40 mb-2">
                        EXECUTION
                      </h4>
                      <p className="text-xs text-brand-light-gray/70 leading-relaxed font-light mb-6">
                        {activeProject.execution}
                      </p>

                      <h4 className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/40 mb-2">
                        RESULTS
                      </h4>
                      <p className="text-xs text-white leading-relaxed font-bold">
                        {activeProject.results}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom metrics section */}
                <div className="border-t border-white/5 pt-8 mt-auto">
                  <h4 className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/40 mb-4 text-left">
                    KEY METRICS
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-left">
                    {activeProject.metrics.map((metric, idx) => (
                      <div key={idx} className="border-l border-white/15 pl-4">
                        <span className="text-[9px] uppercase tracking-widest font-mono text-white/40 block mb-1">
                          Metric 0{idx + 1}
                        </span>
                        <span className="text-sm md:text-lg font-bold text-white block">
                          {metric}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>

            {/* Asymmetric Background Texture representation */}
            <div className={`absolute inset-0 opacity-[0.03] pointer-events-none ${activeProject.bgPattern}`} />
          </div>

        </div>

      </div>
    </section>
  );
}
