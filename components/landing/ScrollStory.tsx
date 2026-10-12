"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ScanBarcode, CreditCard, Package, BarChart3 } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: ScanBarcode,
    judul: "1. Scan Produk",
    deskripsi:
      "Kasir scan barcode atau pilih produk dari grid. Otomatis masuk keranjang.",
  },
  {
    id: 2,
    icon: CreditCard,
    judul: "2. Pelanggan Bayar",
    deskripsi:
      "Pilih metode bayar. Total & kembalian dihitung otomatis. Gak ada salah hitung.",
  },
  {
    id: 3,
    icon: Package,
    judul: "3. Stok Berkurang Otomatis",
    deskripsi:
      "Stok langsung berkurang di sistem. Kalau menipis, langsung di-highlight.",
  },
  {
    id: 4,
    icon: BarChart3,
    judul: "4. Laporan Hari Ini Terisi",
    deskripsi:
      "Omzet hari ini langsung tercatat. Tutup toko, tinggal lihat di HP.",
  },
];

export function ScrollStory() {
  const [activeStep, setActiveStep] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number(entry.target.getAttribute("data-step"));
            setActiveStep(id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    const elements = containerRef.current?.querySelectorAll("[data-step]");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-20 md:py-28 px-4 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-slate-900">
            Satu transaksi, <span className="text-brand-700">semuanya otomatis</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Lihat bagaimana setiap transaksi di Cashier mengalir dari kasir
            sampai laporan.
          </p>
        </div>

        <div
          ref={containerRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
        >
          {/* KIRI: Steps (Scroll) */}
          <div className="space-y-6 lg:space-y-32">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = activeStep === step.id;
              return (
                <div
                  key={step.id}
                  data-step={step.id}
                  className={`transition-all duration-500 ${
                    isActive ? "lg:scale-105" : "lg:opacity-40"
                  }`}
                >
                  <div
                    className={`flex gap-4 p-6 rounded-2xl transition-all duration-500 ${
                      isActive
                        ? "bg-white shadow-xl shadow-slate-200/60 border-2 border-accent-500/20"
                        : "bg-white/60 border border-slate-100"
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                        isActive
                          ? "bg-accent-500 text-white scale-110"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Icon className="w-7 h-7" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3
                        className={`font-display text-xl font-bold mb-2 transition-colors ${
                          isActive ? "text-slate-900" : "text-slate-500"
                        }`}
                      >
                        {step.judul}
                      </h3>
                      <p
                        className={`text-sm transition-colors ${
                          isActive ? "text-slate-600" : "text-slate-400"
                        }`}
                      >
                        {step.deskripsi}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* KANAN: Mockup Fixed */}
          <div className="hidden lg:block sticky top-32">
            <div className="bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 rounded-3xl p-6 md:p-8 shadow-2xl">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-white/40 text-xs ml-2">Cashier App</span>
              </div>

              {/* Mockup yang berubah berdasarkan step */}
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl p-6 aspect-[4/3] flex flex-col justify-center"
              >
                <div className="text-6xl mb-4 text-center">
                  {steps.find((s) => s.id === activeStep)?.id === 1 && "🛒"}
                  {steps.find((s) => s.id === activeStep)?.id === 2 && "💳"}
                  {steps.find((s) => s.id === activeStep)?.id === 3 && "📦"}
                  {steps.find((s) => s.id === activeStep)?.id === 4 && "📊"}
                </div>
                <div className="text-center">
                  <div className="font-display font-bold text-lg text-slate-900 mb-1">
                    {steps.find((s) => s.id === activeStep)?.judul}
                  </div>
                  <div className="text-sm text-slate-500">
                    Step {activeStep} dari 4
                  </div>
                </div>
              </motion.div>

              {/* Progress bar */}
              <div className="mt-6 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-accent-500"
                  animate={{ width: `${(activeStep / 4) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}