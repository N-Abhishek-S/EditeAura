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

          {/* Right Column: Dynamic Simulation Mock Screen */}
          <div className="lg:col-span-5 border border-neutral-200 bg-neutral-50/50 p-6 md:p-8 relative min-h-[420px] flex flex-col justify-between">
            <div className="border-b border-neutral-200 pb-4 mb-6 flex justify-between items-center">
              <span className="text-[10px] font-mono tracking-widest text-neutral-400">CONSOLE // FLOW_PREVIEW</span>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-600 px-2 py-0.5 uppercase tracking-widest font-bold">live simulator</span>
            </div>

            {/* Simulated Live Output Screen */}
            <div className="flex-1 flex flex-col justify-center items-center text-center p-6 bg-white border border-neutral-200 shadow-sm relative overflow-hidden">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full space-y-4"
              >
                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-black mb-2">
                  {pipelineSteps[activeStep].icon}
                </div>
                
                <h4 className="text-lg font-display font-black text-black">
                  Step {activeStep + 1}: {pipelineSteps[activeStep].title}
                </h4>
                
                <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed font-light">
                  {pipelineSteps[activeStep].desc}
                </p>

                {/* Sub-process workflow logs visualization */}
                <div className="bg-neutral-50 p-3 rounded border border-neutral-100 font-mono text-[9px] text-left text-neutral-400 space-y-1 mt-4">
                  <div>&gt; pipeline_id: ea_flow_981</div>
                  <div>&gt; status: {pipelineSteps[activeStep].status.toUpperCase().replace(' ', '_')}</div>
                  <div>&gt; latency: {activeStep === 1 ? '240ms' : '15ms'}</div>
                  <div className="text-black font-bold">&gt; executing_action... OK</div>
                </div>
              </motion.div>
            </div>

            <div className="mt-6 text-center text-[10px] text-neutral-400 font-mono tracking-widest uppercase">
              Engine status: ACTIVE // 100% AUTOMATED
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
