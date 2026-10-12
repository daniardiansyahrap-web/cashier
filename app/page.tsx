import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { SocialProof } from "@/components/landing/SocialProof";
import { BentoFeatures } from "@/components/landing/BentoFeatures";
import { FeatureTabs } from "@/components/landing/FeatureTabs";
import { ScrollStory } from "@/components/landing/ScrollStory";
import { StatStrip } from "@/components/landing/StatStrip";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <StatStrip />
      <SocialProof />
      <BentoFeatures />
      <FeatureTabs />
      <ScrollStory />

      {/* Batch 3 dst akan ditambahkan */}
      <section className="py-20 px-4 text-center text-slate-500 bg-slate-50">
        <p className="text-sm">
          ⏳ Batch 3: Before/After + Fitur Indonesia + Per Jenis Usaha
        </p>
      </section>
    </div>
  );
}