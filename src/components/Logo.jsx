import { Link } from 'react-router-dom';

// TODO: To replace the placeholder logo with the final image, 
// simply drop 'logo-light.png' and 'logo-dark.png' into the src/assets/ folder
// and uncomment the image imports below. 
// For now, it uses a high-fidelity typographic placeholder.

// import logoLight from '../assets/logo-light.png';
// import logoDark from '../assets/logo-dark.png';

export default function Logo({ className = '', variant = 'light' }) {
  // If the assets are missing, we use a fallback logo.
  const isImageAvailable = false; 

  return (
    <Link to="/" className={`inline-flex items-center gap-3 select-none group ${className}`}>
      {isImageAvailable ? (
        <img 
          // eslint-disable-next-line no-undef
          src={variant === 'light' ? logoLight : logoDark} 
          alt="Edit Aura Logo" 
          className="h-8 md:h-10 w-auto object-contain transition-opacity group-hover:opacity-80" 
        />
      ) : (
        <div className="flex items-center gap-3">
          {/* Typographic Placeholder */}
          <div className="font-display font-black tracking-widest text-xl uppercase leading-none">
            EDIT<span className="bg-white text-black px-2 ml-1 pb-0.5">AURA</span>
          </div>
        </div>
      )}
    </Link>
  );
}
