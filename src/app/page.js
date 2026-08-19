import Hero from "@/components/Hero";
import Stats from "@/components/Stats";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#070709] text-white overflow-hidden pb-20">
      {/* Background Vertical Striped Columns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px)] bg-[size:4.5rem_100%] pointer-events-none" />

      {/* Hero Section */}
      <Hero />

      {/* Stats & Globe Section */}
      <Stats />
    </div>
  );
}
