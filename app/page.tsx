import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { SocialProof } from "@/components/landing/SocialProof";
import { BentoFeatures } from "@/components/landing/BentoFeatures";
import { FeatureTabs } from "@/components/landing/FeatureTabs";
import { ScrollStory } from "@/components/landing/ScrollStory";
import { BeforeAfter } from "@/components/landing/BeforeAfter";
import { FiturIndonesia } from "@/components/landing/FiturIndonesia";
import { JenisUsaha } from "@/components/landing/JenisUsaha";
import { RoiCalculator } from "@/components/landing/RoiCalculator";
import { KenapaKami } from "@/components/landing/KenapaKami";
import { Pricing } from "@/components/landing/Pricing";
import { Faq } from "@/components/landing/Faq";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";
import { WhatsAppFloat } from "@/components/landing/WhatsAppFloat";
import { ScrollTop } from "@/components/landing/ScrollTop";
import { StickyCta } from "@/components/landing/StickyCta";
import { StatStrip } from "@/components/landing/StatStrip";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        <Hero />
        <StatStrip />
        <SocialProof />
        <BentoFeatures />
        <FeatureTabs />
        <ScrollStory />
        <BeforeAfter />
        <FiturIndonesia />
        <JenisUsaha />
        <RoiCalculator />
        <KenapaKami />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>

      <Footer />

      {/* Global elements */}
      <WhatsAppFloat />
      <ScrollTop />
      <StickyCta />
    </div>
  );
} 