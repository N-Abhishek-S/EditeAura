import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Founders() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image Animation
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, y: 40 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.2, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          }
        }
      );
      
      // Content Animation
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, x: -30 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 1.2, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="founders" 
      ref={sectionRef} 
      className="text-brand-black py-24 md:py-32 px-6 md:px-12 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #FFFFFF, #F8FAFC)'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
          
          {/* Left Side = Content */}
          <div ref={contentRef} className="flex flex-col gap-6">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-400">
              MEET THE FOUNDERS
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight text-black leading-[1.1]">
              Building AI Systems,<br/>
              Web Experiences &<br/>
              Digital Growth That Deliver Results.
            </h2>
            
            <p className="text-sm text-neutral-500 font-light leading-relaxed max-w-lg mt-4">
              Edit Aura is led by a team of specialists in AI Automation, Web Development and Digital Growth.
              <br/><br/>
              We help businesses streamline operations, automate repetitive tasks, improve customer experience, and build a stronger digital presence.
              <br/><br/>
              Every solution is designed and delivered directly by our founders, ensuring quality, accountability and measurable results.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-col gap-3 mt-4">
              {[
                "AI Automation",
                "Web Development",
                "Social Media Growth",
                "Business Process Optimization",
                "Client-Focused Solutions"
              ].map((badge, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check size={10} strokeWidth={3} />
                  </div>
                  <span className="text-xs font-bold text-neutral-700 tracking-wide uppercase">{badge}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Side = Founder Image */}
          <div className="relative group w-full">
            <div 
              ref={imageRef}
              className="rounded-[24px] overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.12)] bg-white w-full transition-transform duration-400 ease-out hover:-translate-y-[5px]"
            >
              <img 
                src="/assets/images/Founders.jpg" 
                alt="Edit Aura Founders" 
                className="w-full h-auto block"
              />
            </div>
          </div>

        </div>

        {/* Founder Cards Below Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          
          <div className="bg-white rounded-[16px] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-neutral-100 flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
            <div>
              <h3 className="text-xl font-display font-bold text-black mb-1">Abhishek</h3>
            </div>
            <div className="flex flex-col gap-1 mt-auto">
              <span className="text-xs text-neutral-500 font-semibold">• AI Automation Engineer</span>
              <span className="text-xs text-neutral-500 font-semibold">• AI Agent Engineer</span>
              <span className="text-xs text-neutral-500 font-semibold">• Web Developer</span>
            </div>
          </div>

          <div className="bg-white rounded-[16px] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-neutral-100 flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
            <div>
              <h3 className="text-xl font-display font-bold text-black mb-1">Prashant</h3>
            </div>
            <div className="flex flex-col gap-1 mt-auto">
              <span className="text-xs text-neutral-500 font-semibold">• Digital Marketing</span>
              <span className="text-xs text-neutral-500 font-semibold">• Content Strategy</span>
              <span className="text-xs text-neutral-500 font-semibold">• Client Growth</span>
            </div>
          </div>

          <div className="bg-white rounded-[16px] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-neutral-100 flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
            <div>
              <h3 className="text-xl font-display font-bold text-black mb-1">Pavan</h3>
            </div>
            <div className="flex flex-col gap-1 mt-auto">
              <span className="text-xs text-neutral-500 font-semibold">• Social Media Operations</span>
              <span className="text-xs text-neutral-500 font-semibold">• Brand Development</span>
              <span className="text-xs text-neutral-500 font-semibold">• Community Growth</span>
            </div>
          </div>

        </div>

        {/* Statistics Under Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "3 Founders",
            "AI + Web + Growth Expertise",
            "End-to-End Digital Solutions",
            "Focused on Real Business Results"
          ].map((stat, idx) => (
            <div key={idx} className="bg-brand-black text-white p-6 rounded-[16px] flex items-center justify-center text-center shadow-[0_15px_40px_rgba(0,0,0,0.2)]">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest leading-relaxed">{stat}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
