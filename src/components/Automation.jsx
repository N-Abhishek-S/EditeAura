import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, RefreshCw, Layers, Calendar, UserCheck, Play, Pause } from 'lucide-react';

export default function Automation() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const pipelineSteps = [
    {
      id: 0,
      title: 'Attention Capture',
      desc: 'User interacts with a Reel, Meta Ad, or submits a form on your custom landing page.',
      status: 'Trigger Event',
      icon: <Layers size={18} />
    },
    {
      id: 1,
      title: 'WhatsApp Engine Initiated',
      desc: 'System instantly starts a customized WhatsApp thread in < 30 seconds to qualify interest.',
      status: 'Automated Response',
      icon: <MessageSquare size={18} />
    },
    {
      id: 2,
      title: 'CRM DB Synchronization',
      desc: 'Contact details, interest data, and user responses are synced directly to your Hubspot or Notion CRM.',
      status: 'Data Routing',
      icon: <RefreshCw size={18} />
    },
    {
      id: 3,
      title: 'Auto-Scheduler Trigger',
      desc: 'System detects user intent and delivers a personalized Cal.com or Calendly link to secure a slot.',
      status: 'Pipeline Locked',
      icon: <Calendar size={18} />
    },
    {
      id: 4,
      title: 'Qualified Deal Ready',
      desc: 'Your sales team wakes up to a fully qualified calendar event. Total human overhead: zero.',
      status: 'Revenue Event',
      icon: <UserCheck size={18} />
    }
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % pipelineSteps.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <section id="automation" className="bg-brand-white text-brand-black py-24 md:py-32 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-20 text-left">
          <div className="lg:col-span-8">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-400 block mb-4">
              BUSINESS ENGINE
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight text-black leading-[1.1]">
              Let Your Business Work <br className="hidden md:block" />
              While You Sleep.
            </h2>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 border border-black/10 px-4 py-2 hover:border-black transition-colors text-xs font-mono tracking-widest uppercase"
            >
              {isPlaying ? (
                <>
                  <Pause size={12} /> Pause Simulation
                </>
              ) : (
                <>
                  <Play size={12} /> Play Simulation
                </>
              )}
            </button>
          </div>
        </div>

        {/* Layout: Interactive Node Workflow */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Workflow Pipeline */}
          <div className="lg:col-span-7 flex flex-col gap-6 relative pl-6 md:pl-12 border-l border-neutral-100 py-4">
            
            {/* Visual indicator bar */}
            <div className="absolute top-0 bottom-0 left-[23px] md:left-[47px] w-0.5 bg-neutral-200">
              {/* Traveling glow dot */}
              <motion.div
                className="w-full bg-black h-24"
                animate={{
                  top: `${(activeStep / (pipelineSteps.length - 1)) * 80}%`,
                }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </div>

            {pipelineSteps.map((step) => {
              const isCurrent = activeStep === step.id;
              return (
                <div
                  key={step.id}
                  onClick={() => {
                    setActiveStep(step.id);
                    setIsPlaying(false); // Stop autoplay when clicked
                  }}
                  className={`flex gap-6 items-start text-left cursor-pointer p-4 transition-all duration-300 border ${
                    isCurrent
                      ? 'bg-neutral-50 border-black shadow-md translate-x-2'
                      : 'bg-transparent border-transparent hover:bg-neutral-50/50'
                  }`}
                >
                  {/* Step Icon Node */}
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border transition-colors relative z-10 ${
                      isCurrent
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-neutral-400 border-neutral-200'
                    }`}
                  >
                    {step.icon}
                  </div>

                  {/* Step Description */}
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className={`text-sm md:text-base font-display font-bold ${isCurrent ? 'text-black' : 'text-neutral-500'}`}>
                        {step.title}
                      </h4>
                      <span className="text-[9px] uppercase tracking-widest font-mono text-neutral-400">
                        {step.status}
                      </span>
                    </div>
                    <p className={`text-xs ${isCurrent ? 'text-neutral-600' : 'text-neutral-400'} leading-relaxed font-light`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Dashboard Image */}
          <div className="lg:col-span-5 relative flex flex-col justify-center min-h-[420px] pt-8 lg:pt-0">
            {/* Blue and Green Accent Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-500/20 to-emerald-500/20 blur-[80px] rounded-full z-0 pointer-events-none"></div>
            
            <div className="w-full relative z-10 rounded-[24px] overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.3)] border border-white/10 bg-black/5">
              <div className="absolute inset-0 img-overlay z-10 pointer-events-none"></div>
              
              <img 
                src="/assets/images/Automation.png" 
                alt="Automation System Engine" 
                className="w-full h-full object-cover hover-scale-img aspect-[4/3] md:aspect-auto"
              />
              
              {/* Floating Information Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-md border border-white/10 rounded-[16px] p-4 z-20 shadow-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <div>
                    <span className="text-white text-[10px] font-mono tracking-widest uppercase block mb-1">Status</span>
                    <span className="text-white text-sm font-bold">100% Automated Workflow</span>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-white/60 text-[10px] font-mono tracking-widest uppercase block mb-1">Active Deals</span>
                  <span className="text-emerald-400 text-sm font-mono font-bold">+24%</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
