"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { jenisUsaha } from "@/lib/landing-data";
import { ArrowRight, Sparkles } from "lucide-react";

export function JenisUsaha() {
  const [active, setActive] = useState(jenisUsaha[0].id);
  const aktif = jenisUsaha.find((j) => j.id === active) || jenisUsaha[0];

  return (
    <section className="relative py-20 md:py-28 px-4 bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest shadow-sm">
            <span className="w-1.5 h-1.5 bg-accent-500 rounded-full animate-pulse" />
            Per Jenis Usaha
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-slate-900">
            Cocok untuk <span className="text-brand-700">semua jenis toko</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Pilih jenis usaha kamu, lihat bagaimana Cashier membantu.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {jenisUsaha.map((usaha) => {
            const isActive = active === usaha.id;
            return (
              <button
                key={usaha.id}
                onClick={() => setActive(usaha.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-brand-700 text-white shadow-lg shadow-brand-700/30"
                    : "bg-white text-slate-700 border border-slate-200 hover:border-brand-300"
                }`}
              >
                <span>{usaha.emoji}</span>
                {usaha.nama}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
            >
              {/* Kiri: Content */}
              <div>
                <div className="text-5xl mb-4">{aktif.emoji}</div>
                <h3 className="font-display text-2xl md:text-3xl font-bold mb-3 text-slate-900">
                  {aktif.nama}
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {aktif.manfaat}
                </p>

                <div className="inline-flex items-center gap-2 bg-accent-50 text-accent-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  <Sparkles className="w-4 h-4" />
                  Fitur Andalan: {aktif.fiturAndalan}
                </div>

                <button className="flex items-center gap-2 text-brand-700 font-semibold text-sm hover:gap-3 transition-all">
                  Coba Gratis 14 Hari <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Kanan: Mockup ringkas */}
              <div className="bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 rounded-2xl p-6 aspect-square flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-7xl mb-4">{aktif.emoji}</div>
                  <div className="text-sm opacity-60">Mockup {aktif.nama}</div>
                  <div className="text-xs opacity-40 mt-2">
                    (Placeholder — akan diisi UI)
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}