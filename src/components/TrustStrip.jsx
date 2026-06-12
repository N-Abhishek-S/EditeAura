import { Check } from 'lucide-react';

export default function TrustStrip() {
  // Admin-friendly structure: Add logo paths here when verified clients are acquired
  const clientLogos = []; 

  const trustSignals = [
    "Transparent Pricing",
    "Direct Communication",
    "Custom Solutions",
    "No Hidden Charges",
    "Modern Technology Stack"
  ];

  return (
    <section className="bg-brand-white text-brand-black py-16 border-y border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Verified Trust Signals */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-16">
          {trustSignals.map((signal, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-black/5 flex items-center justify-center text-black">
                <Check size={12} strokeWidth={3} />
              </div>
              <span className="text-xs md:text-sm font-bold tracking-wide uppercase text-black/80">
                {signal}
              </span>
            </div>
          ))}
        </div>

        {/* Client Logos Placeholder */}
        <div className="text-center">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-400 block mb-8">
            TRUSTED BY
          </span>
          {clientLogos.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale">
              {clientLogos.map((logo, index) => (
                <img key={index} src={logo} alt="Client Logo" className="h-8 md:h-12 object-contain" />
              ))}
            </div>
          ) : (
            <div className="w-full max-w-2xl mx-auto py-12 border border-dashed border-neutral-300 bg-neutral-50/50">
              <p className="text-sm text-neutral-500 font-mono">
                [ Client logos will be displayed here. ]
              </p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
