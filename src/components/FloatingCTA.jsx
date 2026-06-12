import { useState, useEffect } from 'react';
import { MessageCircle, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling down 300px
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = () => {
    if (window.location.hash !== '#/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById('contact');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex items-center justify-end pointer-events-none">
      
      {/* Mobile CTA: WhatsApp */}
      <a
        href="https://wa.me/yourwhatsappnumber" 
        target="_blank"
        rel="noopener noreferrer"
        className="md:hidden w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20 pointer-events-auto hover:scale-105 transition-transform"
        aria-label="Contact on WhatsApp"
      >
        <MessageCircle size={28} />
      </a>

      {/* Desktop CTA: Book Call */}
      <button
        onClick={handleNavClick}
        className="hidden md:flex items-center gap-3 bg-white text-black px-6 py-4 rounded-none shadow-2xl shadow-white/10 pointer-events-auto hover:bg-neutral-200 transition-colors group cursor-pointer"
      >
        <Calendar size={18} className="group-hover:-rotate-12 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Book a Call</span>
      </button>

    </div>
  );
}
