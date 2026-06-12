import React from 'react';
import Hero from '../components/Hero';
import TrustStrip from '../components/TrustStrip';
import WhyUs from '../components/WhyUs';
import Services from '../components/Services';
import FeaturedWork from '../components/FeaturedWork';
import BehindTheScenes from '../components/BehindTheScenes';
import Testimonials from '../components/Testimonials';
import PackagesPreview from '../components/PackagesPreview';
import FinalCTA from '../components/FinalCTA';

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustStrip />
      <WhyUs />
      <Services />
      <FeaturedWork />
      <BehindTheScenes />
      <Testimonials />
      <PackagesPreview />
      <FinalCTA />
    </main>
  );
}
