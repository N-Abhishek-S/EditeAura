import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

import logo1 from '../assets/images/real-client-1.png';
import logo2 from '../assets/images/real-client-2.png';
import logo3 from '../assets/images/real-client-3.png';
import logo4 from '../assets/images/real-client-4.jpg';

const clients = [
  {
    id: 1,
    name: 'ArrayPointer',
    logo: logo1,
    industry: 'TECHNOLOGY',
    logoStyle: 'max-w-[88%] max-h-[60%]'
  },
  {
    id: 2,
    name: "Shree's Cafe & Snacks",
    logo: logo2,
    industry: 'FOOD & BEVERAGE',
    logoStyle: 'max-w-[90%] max-h-[90%]'
  },
  {
    id: 3,
    name: "Domipos",
    logo: logo3,
    industry: 'E-COMMERCE',
    logoStyle: 'max-w-[80%] max-h-[80%]'
  },
  {
    id: 4,
    name: 'Creamino Ice Cream',
    logo: logo4,
    industry: 'FOOD & BEVERAGE',
    logoStyle: 'max-w-[92%] max-h-[92%]'
  }
];

export default function ClientShowcase() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="bg-[#050505] text-white py-24 md:py-32 px-6 md:px-12 relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-[#7C5CFF] opacity-[0.08] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-[#5B8CFF] opacity-[0.06] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-[700px] mx-auto mb-20 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            {/* Top Badge */}
            <div className="mb-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#7C5CFF]/40 bg-white/[0.04] backdrop-blur-xl shadow-[0_0_20px_rgba(124,92,255,0.15)]">
              <span className="text-[13px] font-bold tracking-widest text-white uppercase">✨ Our Happy Clients</span>
            </div>

            <h2 className="text-[38px] sm:text-[44px] md:text-[56px] lg:text-[72px] font-display font-[800] mb-6 tracking-tighter leading-[1.05]">
              Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFF] to-[#5B8CFF]">Growing Brands</span>
            </h2>
            <p className="text-white/75 text-lg md:text-xl font-light leading-relaxed">
              Businesses that trusted Edit Aura for branding, content, design, and digital growth.
            </p>
          </motion.div>
        </div>

        {/* Client Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {clients.map((client) => (
            <motion.div 
              key={client.id}
              variants={itemVariants}
              className="group relative bg-white/[0.02] border border-white/[0.08] backdrop-blur-md rounded-[28px] p-8 flex flex-col items-center text-center transition-all duration-300 ease-out hover:-translate-y-[6px] hover:border-[#7C5CFF]/40 hover:shadow-[0_25px_50px_-15px_rgba(124,92,255,0.2)] min-h-[320px] max-h-[360px]"
            >
              {/* Premium Logo Container */}
              <div className="w-[150px] h-[150px] rounded-full bg-white shadow-[0_15px_35px_rgba(0,0,0,0.25)] flex items-center justify-center p-2.5 mb-6 overflow-hidden flex-shrink-0">
                <img 
                  src={client.logo} 
                  alt={`${client.name} logo`} 
                  className={`object-contain group-hover:scale-[1.03] transition-transform duration-300 ease-out ${client.logoStyle}`}
                  loading="lazy"
                />
              </div>

              {/* Client Name & Industry */}
              <div className="flex flex-col items-center justify-center w-full mt-auto">
                <h4 className="text-white font-[700] text-[18px] md:text-[20px] lg:text-[22px] leading-[1.3] mb-3">
                  {client.name}
                </h4>
                <span className="text-[13px] md:text-[14px] font-[600] text-[#8A63FF] uppercase tracking-[0.25em]">
                  {client.industry}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <div className="relative flex items-center justify-center mb-20">
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="relative bg-[#050505] px-6">
            <Star className="w-6 h-6 text-[#7C5CFF]" fill="currentColor" />
          </div>
        </div>

        <motion.div 
          className="text-center flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-[28px] md:text-[40px] font-display font-[700] text-white mb-4 tracking-tight">
            Want Your Brand Featured Here?
          </h3>
          <p className="text-white/60 text-lg md:text-xl mb-12 font-light">
            Let's create something amazing together.
          </p>
          
          <button className="flex items-center justify-center gap-3 bg-gradient-to-r from-[#6F4BFF] to-[#8A63FF] text-white px-6 md:px-8 h-[56px] rounded-[16px] text-base font-semibold hover:scale-[1.03] transition-all duration-300 shadow-[0_15px_30px_-10px_rgba(111,75,255,0.7)] hover:shadow-[0_20px_40px_-10px_rgba(111,75,255,0.8)]">
            Let's Work Together 
            <span className="font-normal text-xl leading-none">→</span>
          </button>
        </motion.div>

      </div>
    </section>
  );
}
