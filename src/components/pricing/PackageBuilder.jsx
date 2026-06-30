import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, Calculator } from 'lucide-react';
import { servicesData, addons } from '../../data/pricingData';

export default function PackageBuilder() {
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState({});
  const [selectedExtras, setSelectedExtras] = useState([]);

  // Toggle service selection
  const toggleService = (serviceId) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        const next = prev.filter(id => id !== serviceId);
        // Clean up packages related to this service
        const nextPkgs = { ...selectedPackages };
        delete nextPkgs[serviceId];
        setSelectedPackages(nextPkgs);
        return next;
      }
      return [...prev, serviceId];
    });
  };

  // Select a package for a service
  const selectPackage = (serviceId, packageId) => {
    setSelectedPackages(prev => ({
      ...prev,
      [serviceId]: packageId
    }));
  };

  // Toggle extra addons
  const toggleExtra = (addonTitle) => {
    setSelectedExtras(prev => 
      prev.includes(addonTitle) 
        ? prev.filter(t => t !== addonTitle)
        : [...prev, addonTitle]
    );
  };

  // Calculate total estimated price (just base prices for quote estimation)
  const estimatedTotal = useMemo(() => {
    let total = 0;
    
    // Add package prices
    Object.entries(selectedPackages).forEach(([sId, pId]) => {
      const service = servicesData.find(s => s.id === sId);
      if (service) {
        const pkg = service.packages.find(p => p.id === pId);
        if (pkg && typeof pkg.price === 'number') {
          total += pkg.price;
        }
      }
    });

    // Add extras
    selectedExtras.forEach(title => {
      const addon = addons.find(a => a.title === title);
      if (addon && typeof addon.price === 'number') {
        total += addon.price;
      }
    });

    return total;
  }, [selectedPackages, selectedExtras]);

  const handleQuoteRequest = () => {
    const servicesText = selectedServices.map(id => servicesData.find(s=>s.id === id)?.title).join(", ");
    const pkgsText = Object.values(selectedPackages).join(", "); // simple string representation
    const msg = `Hi, I used the custom builder. I'm interested in: ${servicesText}. Extras: ${selectedExtras.join(', ')}. Estimated total was ₹${estimatedTotal.toLocaleString('en-IN')}.`;
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/919876543210?text=${encoded}`, '_blank');
  };

  return (
    <div className="py-24 bg-[#050505] border-y border-[#1A1A1A] relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#C89B3C]/30 to-transparent"></div>
      
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-4">
            Custom Package Builder
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Build your own tailored digital growth package and get an instant estimated quote.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Builder Steps */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* STEP 1 */}
            <div className="bg-[#0A0A0A] border border-[#222222] rounded-2xl p-6 md:p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm shrink-0">1</div>
                <h3 className="text-xl font-medium text-white">Select Services</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {servicesData.map(service => (
                  <button
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={`text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${
                      selectedServices.includes(service.id)
                        ? 'bg-[#111111] border-[#C89B3C] shadow-[0_0_15px_rgba(200,155,60,0.1)]'
                        : 'bg-transparent border-[#222222] hover:border-[#444444]'
                    }`}
                  >
                    <span className={`font-medium ${selectedServices.includes(service.id) ? 'text-[#C89B3C]' : 'text-white/70 group-hover:text-white'}`}>
                      {service.title}
                    </span>
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      selectedServices.includes(service.id) ? 'bg-[#C89B3C] border-[#C89B3C]' : 'border-[#444444]'
                    }`}>
                      {selectedServices.includes(service.id) && <Check size={14} className="text-black" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 2 */}
            <AnimatePresence>
              {selectedServices.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#0A0A0A] border border-[#222222] rounded-2xl p-6 md:p-10"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm shrink-0">2</div>
                    <h3 className="text-xl font-medium text-white">Select Deliverables</h3>
                  </div>
                  
                  <div className="space-y-8">
                    {selectedServices.map(serviceId => {
                      const service = servicesData.find(s => s.id === serviceId);
                      if (!service) return null;
                      return (
                        <div key={serviceId} className="space-y-4">
                          <h4 className="text-sm font-medium text-white/50 uppercase tracking-widest border-b border-[#222222] pb-2">
                            {service.title}
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                            {service.packages.map(pkg => (
                              <button
                                key={pkg.id}
                                onClick={() => selectPackage(serviceId, pkg.id)}
                                className={`text-left p-4 rounded-xl border transition-all flex flex-col gap-2 ${
                                  selectedPackages[serviceId] === pkg.id
                                    ? 'bg-[#111111] border-[#C89B3C] shadow-[0_0_15px_rgba(200,155,60,0.1)]'
                                    : 'bg-transparent border-[#222222] hover:border-[#444444]'
                                }`}
                              >
                                <span className={`font-medium text-sm ${selectedPackages[serviceId] === pkg.id ? 'text-[#C89B3C]' : 'text-white/80'}`}>
                                  {pkg.name}
                                </span>
                                <span className="text-xs text-white/50 font-medium">
                                  {typeof pkg.price === 'number' ? `₹${pkg.price.toLocaleString('en-IN')}` : pkg.price}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* STEP 3 */}
            <div className="bg-[#0A0A0A] border border-[#222222] rounded-2xl p-6 md:p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm shrink-0">3</div>
                <h3 className="text-xl font-medium text-white">Add Extras</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {addons.slice(0, 12).map((addon, idx) => ( // Show popular ones to avoid clutter
                  <button
                    key={idx}
                    onClick={() => toggleExtra(addon.title)}
                    className={`text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                      selectedExtras.includes(addon.title)
                        ? 'bg-[#111111] border-[#C89B3C] shadow-[0_0_15px_rgba(200,155,60,0.1)]'
                        : 'bg-transparent border-[#222222] hover:border-[#444444]'
                    }`}
                  >
                    <div>
                      <div className={`font-medium text-sm ${selectedExtras.includes(addon.title) ? 'text-[#C89B3C]' : 'text-white/70 group-hover:text-white'}`}>
                        {addon.title}
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                      selectedExtras.includes(addon.title) ? 'bg-[#C89B3C] border-[#C89B3C]' : 'border-[#444444]'
                    }`}>
                      {selectedExtras.includes(addon.title) && <Check size={12} className="text-black" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* STEP 4 - Sticky Live Quote */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-[#111111] border border-[#333333] rounded-2xl p-8 flex flex-col min-h-[400px]">
              <div className="flex items-center gap-3 text-white/50 mb-6">
                <Calculator size={20} />
                <span className="font-medium text-sm tracking-widest uppercase">Live Quote</span>
              </div>
              
              <div className="flex-1">
                <div className="text-sm font-medium text-white/50 mb-2">Estimated Investment</div>
                <div className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-4 flex items-start gap-1">
                  <span className="text-2xl mt-1.5 text-[#C89B3C]">₹</span>
                  {estimatedTotal.toLocaleString('en-IN')}
                </div>
                
                {(Object.keys(selectedPackages).length > 0 || selectedExtras.length > 0) && (
                  <div className="space-y-4 mb-8 pt-6 border-t border-[#333333]">
                    {Object.entries(selectedPackages).map(([sId, pId]) => {
                      const s = servicesData.find(x => x.id === sId);
                      const p = s?.packages.find(x => x.id === pId);
                      return (
                        <div key={sId} className="flex justify-between text-sm">
                          <span className="text-white/70">{p?.name}</span>
                          <span className="text-white font-medium">₹{p?.price.toLocaleString('en-IN')}</span>
                        </div>
                      );
                    })}
                    {selectedExtras.map(ext => {
                      const add = addons.find(a => a.title === ext);
                      return (
                        <div key={ext} className="flex justify-between text-sm">
                          <span className="text-white/70">{ext}</span>
                          <span className="text-white font-medium">₹{add?.price.toLocaleString('en-IN')}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="mt-8 space-y-4">
                <p className="text-xs text-white/40 leading-relaxed mb-4 text-center">
                  This is an estimated quotation. Final pricing may vary depending on project complexity.
                </p>
                <button 
                  onClick={handleQuoteRequest}
                  className="w-full bg-white text-black hover:bg-neutral-200 transition-colors py-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2"
                >
                  Request Custom Quote
                </button>
                <button 
                  onClick={() => window.open('https://calendly.com/', '_blank')}
                  className="w-full bg-transparent text-white border border-[#444444] hover:bg-[#1A1A1A] transition-colors py-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2"
                >
                  Book Strategy Call
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
