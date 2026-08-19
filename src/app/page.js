import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import JobDiscovery from "@/components/home/JobDiscovery";
import Features from "@/components/home/Features";
import Pricing from "@/components/home/Pricing";
import CTA from "@/components/home/CTA";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#070709] text-white overflow-hidden pb-6">
      {/* Background Vertical Striped Columns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px)] bg-[size:4.5rem_100%] pointer-events-none" />

      {/* Hero Section */}
      <Hero />

      {/* Stats & Globe Section */}
      <Stats />

      {/* Smart Job Discovery Section */}
      <JobDiscovery />

      {/* Features Section */}
      <Features />

      {/* Pricing Section */}
      <Pricing />

      {/* Call to Action Section */}
      <CTA />
    </div>
  );
}
