import { useRef, useEffect } from 'react';

function ProjectCard({ project }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Play when entering viewport
            videoElement.play().catch(() => {
              // Ignore auto-play blocking errors
            });
          } else {
            // Pause when leaving viewport to save resources
            videoElement.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(videoElement);
    return () => {
      if (videoElement) {
        observer.unobserve(videoElement);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // Handle action if needed
    }
  };

  return (
    <div 
      className="group border border-white/10 bg-brand-dark/20 transition-all duration-300 p-6 flex flex-col hover:border-white/20 focus-within:border-white/20 focus-within:ring-1 focus-within:ring-white/50"
      onMouseEnter={handleMouseEnter}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="button"
      aria-label={`View case study for ${project.title}`}
    >
      {/* Video Player */}
      <div className="w-full aspect-[4/3] bg-[#0a0a0a] flex items-center justify-center border border-white/5 mb-6 relative overflow-hidden">
        <video 
          ref={videoRef}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 group-hover:brightness-110 transition-all duration-500"
          autoPlay 
          muted 
          loop 
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src={project.videoSrc} type="video/mp4" />
        </video>
      </div>
      
      {/* Project title */}
      <h3 className="text-2xl font-display font-bold text-white mb-3">
        {project.title}
      </h3>
      
      {/* Description */}
      <p className="text-sm text-brand-light-gray/60 font-light mb-6 flex-grow">
        {project.description}
      </p>
      
      {/* Technology stack */}
      <div className="flex flex-wrap gap-2 mb-8">
        {project.tags.map((tech) => (
          <span key={tech} className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-1 text-white/50 uppercase tracking-widest">
            {tech}
          </span>
        ))}
      </div>
      
      {/* Case study button */}
      <button 
        tabIndex={-1}
        className="mt-auto w-full py-4 border border-white/20 text-xs font-bold tracking-widest uppercase text-white group-hover:bg-white group-hover:text-black transition-colors duration-300"
      >
        {project.cta}
      </button>
    </div>
  );
}

export default function FeaturedWork() {
  const portfolioProjects = [
    {
      title: "Premium Content Campaign",
      description: "A high-conversion video strategy highlighting brand identity and product features through dynamic, engaging edits.",
      videoSrc: "/assets/videos/work1.mp4",
      tags: ["Video Editing", "Content Strategy", "Motion Graphics"],
      cta: "View Case Study"
    },
    {
      title: "Jewels Showcase",
      description: "Premium luxury jewelry commercial created for social media campaigns, product launches, and digital advertising.",
      videoSrc: "/assets/videos/jewels_showcase.mp4",
      tags: ["Luxury", "Jewelry", "Commercial", "Product Video"],
      cta: "View Case Study"
    },
    {
      title: "Bakery Campaign",
      description: "Cinematic bakery advertisement highlighting premium products through storytelling, motion graphics, and commercial editing.",
      videoSrc: "/assets/videos/bakeries.mp4",
      tags: ["Food", "Bakery", "Commercial", "Video Editing"],
      cta: "View Case Study"
    },
    {
      title: "Klickpin Campaign",
      description: "Modern promotional advertisement created for Klickpin using premium motion graphics, product storytelling, and cinematic editing.",
      videoSrc: "/assets/videos/Klickpin.mp4",
      tags: ["Startup", "Product", "Motion Graphics", "Advertisement"],
      cta: "View Case Study"
    }
  ];

  return (
    <section id="work" className="bg-brand-black text-brand-white py-24 md:py-32 px-6 md:px-12 relative overflow-hidden border-b border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40 block mb-4">
            PROVEN RESULTS
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight text-white leading-none mb-6">
            Featured Work.
          </h2>
          <p className="text-brand-light-gray/60 font-light max-w-xl mx-auto">
            Verified project showcase demonstrating our strategic creative execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {portfolioProjects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
