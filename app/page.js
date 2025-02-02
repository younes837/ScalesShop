import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import PopularCategories from "@/components/landing/PopularCategories";
import PricingShowcase from "@/components/landing/PricingShowcase";
import TrustSection from "@/components/landing/TrustSection";
import CtaSection from "@/components/landing/CtaSection";
import { Navbar } from "@/components/layout/Navbar";
import NewProducts from "@/components/landing/NewProducts";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <main className="min-h-screen">
        <Hero />
        <NewProducts />
        <PopularCategories />
        <Features />
        {/* <PricingShowcase /> */}
        <TrustSection />
        <CtaSection />
      </main>
    </main>
  );
}
