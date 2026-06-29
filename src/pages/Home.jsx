import Hero from '../components/Hero';
import Founders from '../components/Founders';
import WhyUs from '../components/WhyUs';
import Services from '../components/Services';
import FeaturedWork from '../components/FeaturedWork';
import { DesignShowcase } from '../components/design-showcase';
import BehindTheScenes from '../components/BehindTheScenes';
import ClientShowcase from '../components/ClientShowcase';
import PackagesPreview from '../components/PackagesPreview';
import FinalCTA from '../components/FinalCTA';

export default function Home() {
  return (
    <main>
      <Hero />
      <Founders />
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
