import Hero from '../components/Hero';
import Founders from '../components/Founders';
import TrustStrip from '../components/TrustStrip';
import WhyUs from '../components/WhyUs';
import Services from '../components/Services';
import FeaturedWork from '../components/FeaturedWork';
import BehindTheScenes from '../components/BehindTheScenes';
import ClientShowcase from '../components/ClientShowcase';
import PackagesPreview from '../components/PackagesPreview';
import FinalCTA from '../components/FinalCTA';

export default function Home() {
  return (
    <main>
      <Hero />
      <Founders />
      <TrustStrip />
      <WhyUs />
      <Services />
      <FeaturedWork />
      <BehindTheScenes />
      <ClientShowcase />
      <PackagesPreview />
      <FinalCTA />
    </main>
  );
}
