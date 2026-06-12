import { useState, useEffect } from 'react';
import Logo from './Logo';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const navLinks = [
    { name: 'Services', isAnchor: true, target: 'services' },
    { name: 'Work', isAnchor: true, target: 'work' },
    { name: 'Process', isAnchor: true, target: 'process' },
    { name: 'Packages', isAnchor: false, path: '/packages' },
    { name: 'FAQ', isAnchor: true, target: 'faq' },
  ];

  const handleNavClick = (isAnchor, target) => {
    setMobileMenuOpen(false);
    if (!isAnchor) {
      return; // Link handles routing natively
    }
    // If it's an anchor, navigate to home first if not there, then scroll
    if (window.location.hash !== '#/') {
      // eslint-disable-next-line react-hooks/immutability
      window.location.hash = '#/';
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-editorial ${
        isScrolled
          ? 'bg-brand-black/85 backdrop-blur-xl border-b border-white/5 py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            !link.isAnchor ? (
              <Link
                key={link.name}
                to={link.path}
                className="text-xs uppercase tracking-widest text-brand-light-gray/60 hover:text-white transition-colors duration-300 font-medium"
              >
                {link.name}
              </Link>
            ) : (
              <button
                key={link.name}
                onClick={() => handleNavClick(true, link.target)}
                className="text-xs uppercase tracking-widest text-brand-light-gray/60 hover:text-white transition-colors duration-300 font-medium"
              >
                {link.name}
              </button>
            )
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center">
          <a
            href="#contact"
            className="group relative overflow-hidden border border-white/20 hover:border-white px-5 py-2.5 text-xs uppercase tracking-widest text-white transition-colors duration-500 rounded-none bg-transparent"
          >
            <span className="relative z-10">Book a Strategy Call</span>
            <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"></span>
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-1"></span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white focus:outline-none p-1"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`fixed inset-0 top-[60px] bg-brand-black z-40 flex flex-col justify-between p-8 border-t border-white/5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col gap-6 mt-8">
          {navLinks.map((link, idx) => (
            !link.isAnchor ? (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-display font-light uppercase tracking-widest text-white hover:text-brand-gray transition-colors"
                style={{ animationDelay: `${idx * 75}ms` }}
              >
                {link.name}
              </Link>
            ) : (
              <button
                key={link.name}
                onClick={() => handleNavClick(true, link.target)}
                className="text-2xl font-display font-light uppercase tracking-widest text-left text-white hover:text-brand-gray transition-colors"
                style={{ animationDelay: `${idx * 75}ms` }}
              >
                {link.name}
              </button>
            )
          ))}
        </nav>
        
        <div className="flex flex-col gap-4 mb-12">
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-center border border-white px-6 py-4 text-xs uppercase tracking-widest text-black bg-white font-semibold transition-all hover:bg-transparent hover:text-white"
          >
            Book a Strategy Call
          </a>
          <span className="text-center text-[10px] text-brand-gray tracking-wider uppercase">
            make them pause
          </span>
        </div>
      </div>
    </header>
  );
}
