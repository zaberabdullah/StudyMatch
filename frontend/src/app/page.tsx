import Hero from "@/components/home/Hero";
import FeaturedUniversities from "@/components/home/FeaturedUniversities";
import HowItWorks from "@/components/home/HowItWorks";
import Stats from "@/components/home/Stats";
import AIFeatures from "@/components/home/AIFeatures";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import NewsletterCTA from "@/components/home/NewsletterCTA";
import Countries from "@/components/home/Countries";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedUniversities />
      <HowItWorks />
      <Stats />
      <AIFeatures />
      <Testimonials />
      <Countries />
      <FAQ />
      <NewsletterCTA />
    </>
  );
}
