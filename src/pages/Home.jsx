import { lazy, Suspense } from 'react';
import Hero from '../components/Hero';
import WhyUs from '../components/WhyUs';
import Services from '../components/Services';
import FeaturedWork from '../components/FeaturedWork';
import { DesignShowcase } from '../components/design-showcase';
import BehindTheScenes from '../components/BehindTheScenes';
import ClientShowcase from '../components/ClientShowcase';
import PackagesPreview from '../components/PackagesPreview';
import FinalCTA from '../components/FinalCTA';

// Lazy-load the AI section — it's below the fold and has significant code
const AIVoiceConsultant = lazy(() => import('../components/AIVoiceConsultant/index.jsx'));

// Minimal skeleton shown while AIVoiceConsultant loads
function VoiceSectionSkeleton() {
  return (
    <section className="py-24 md:py-32 bg-[#030305]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 animate-pulse">
          <div className="h-3 w-32 rounded-full bg-white/5" />
          <div className="h-10 w-80 rounded-xl bg-white/5" />
          <div className="h-4 w-56 rounded-full bg-white/3" />
          <div className="w-40 h-40 rounded-full bg-white/3 mt-4" />
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main>
      <Hero />
      <Suspense fallback={<VoiceSectionSkeleton />}>
        <AIVoiceConsultant />
      </Suspense>
      <WhyUs />
      <Services />
      <FeaturedWork />
      <DesignShowcase />
      <BehindTheScenes />
      <ClientShowcase />
      <PackagesPreview />
      <FinalCTA />
    </main>
  );
}
