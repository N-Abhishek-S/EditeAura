import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { ArrowUp, Instagram, Linkedin, MessageCircle, Mail } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigate = useNavigate();

  const handleNavClick = (target) => {
    if (window.location.hash !== '#/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-brand-black text-brand-white border-t border-white/5 pt-16 pb-8 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 items-start text-left">
          
          {/* Logo and Tagline Column */}
          <div className="md:col-span-4 space-y-4">
            <Logo />
            <p className="text-xs text-white/40 tracking-[0.2em] uppercase pt-2">
              "make them pause"
            </p>
            <p className="text-[11px] text-white/30 max-w-xs leading-relaxed font-light">
              Bespoke creative growth studio building high-caliber visual systems and business automation engines.
            </p>
          </div>

          {/* Nav columns */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
              STUDIO
            </h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => handleNavClick('services')} className="text-white/60 hover:text-white transition-colors">Services</button></li>
              <li><button onClick={() => handleNavClick('work')} className="text-white/60 hover:text-white transition-colors">Portfolio</button></li>
              <li><Link to="/packages" className="text-white/60 hover:text-white transition-colors">Packages</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h4 className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
              COMPANY
            </h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => handleNavClick('why-us')} className="text-white/60 hover:text-white transition-colors">Why Us</button></li>
              <li><button onClick={() => handleNavClick('faq')} className="text-white/60 hover:text-white transition-colors">FAQs</button></li>
              <li><button onClick={() => handleNavClick('contact')} className="text-white/60 hover:text-white transition-colors">Briefing</button></li>
            </ul>
          </div>

          {/* Socials Column */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
              DIRECT CHANNELS
            </h4>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/editaura_ea"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-white/10 hover:border-white hover:bg-white/5 flex items-center justify-center text-white transition-all"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://www.linkedin.com/in/edit-aura"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-white/10 hover:border-white hover:bg-white/5 flex items-center justify-center text-white transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="https://wa.me/yourwhatsappnumber"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-white/10 hover:border-white hover:bg-white/5 flex items-center justify-center text-white transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle size={16} />
              </a>
              <a
                href="mailto:editaura.ea@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-white/10 hover:border-white hover:bg-white/5 flex items-center justify-center text-white transition-all"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
            </div>
            <p className="text-[10px] text-white/30 font-mono">
              DIRECT // editaura.ea@gmail.com
            </p>
          </div>

        </div>

        {/* Bottom copyright & back to top */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-left">
          <p className="text-[10px] text-white/30 uppercase tracking-wider font-mono">
            &copy; {new Date().getFullYear()} EDIT AURA. ALL RIGHTS SECURED.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 border border-white/10 hover:border-white px-4 py-2 hover:bg-white/5 transition-all text-[10px] font-mono tracking-widest uppercase"
          >
            Back To Top <ArrowUp size={12} />
          </button>
        </div>

      </div>
    </footer>
  );
}
