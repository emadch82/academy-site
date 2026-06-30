import { HeroSection } from '@/components/sections/hero';
import { StatsSection } from '@/components/sections/stats';
import { FeaturedCourses } from '@/components/sections/featured-courses';
import { WhyUsSection } from '@/components/sections/why-us';
import { AboutSection } from '@/components/sections/about';
import { TestimonialsSection } from '@/components/sections/testimonials';
import { ContactSection } from '@/components/sections/contact';

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection />
      <StatsSection />
      <FeaturedCourses />
      <WhyUsSection />
      <AboutSection />
      <TestimonialsSection />
      <ContactSection />
    </main>
  );
}
