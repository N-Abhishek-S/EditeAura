
export default function Testimonials() {
  // Admin-friendly structure: Add real testimonial objects here when ready
  const testimonials = []; 

  return (
    <section className="bg-brand-black text-brand-white py-24 md:py-32 px-6 md:px-12 relative overflow-hidden border-b border-white/5">
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40 block mb-8">
          CLIENT VERDICT
        </span>
        
        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="border border-white/10 p-8 text-left bg-white/5">
                <blockquote className="text-lg italic text-brand-light-gray">"{t.quote}"</blockquote>
                <p className="mt-4 text-sm text-white font-bold">{t.author}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="min-h-[120px] flex flex-col items-center justify-center relative border border-white/10 bg-white/[0.02] p-12">
            <h3 className="text-xl md:text-3xl font-display font-light leading-relaxed text-brand-light-gray italic mb-4">
              "We are currently building our client portfolio."
            </h3>
            <p className="text-sm font-light text-white/50">
              Testimonials will appear here as projects are completed.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
