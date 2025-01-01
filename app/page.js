import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import PopularCategories from "@/components/landing/PopularCategories";
import PricingShowcase from "@/components/landing/PricingShowcase";
import TrustSection from "@/components/landing/TrustSection";
import CtaSection from "@/components/landing/CtaSection";
import { Navbar } from "@/components/layout/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <main className="min-h-screen">
        <Hero />
        <Features />
        <PopularCategories />
        <PricingShowcase />
        <TrustSection />
        <CtaSection />
      </main>
    </main>
  );
}
