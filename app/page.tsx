import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { StatStrip } from "@/components/landing/StatStrip";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <StatStrip />

      {/* Section lainnya akan ditambahkan di batch berikutnya */}
      <section className="py-20 px-4 text-center text-slate-500">
        <p className="text-sm">
          ⏳ Section Fitur, Harga, FAQ, dll akan ditambahkan di batch berikutnya
        </p>
      </section>
    </div>
  );
}