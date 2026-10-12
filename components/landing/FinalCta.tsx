"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Calendar } from "lucide-react";
import { WA_LINK } from "@/lib/constants";

export function FinalCta() {
  return (
    <section className="relative py-20 md:py-28 px-4 bg-slate-100 overflow-hidden">
      {/* Dots pattern */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #94a3b8 0.5px, transparent 0.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Aurora blob subtle */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-300/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-300/15 rounded-full blur-[120px]" />

      <div className="relative max-w-5xl mx-auto">
        {/* CARD PUTIH dengan COLORED GLOW */}
        <div className="relative">
          {/* GLOW DI BELAKANG CARD */}
          <div className="absolute inset-0 rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-brand-500/30 via-accent-500/20 to-cyan-500/30 blur-2xl opacity-70 -z-10" />

          {/* CARD PUTIH */}
          <div className="relative bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-brand-500/20 px-6 md:px-12 py-16 md:py-20 border border-white overflow-hidden">
            {/* Dekorasi sudut barcode */}
           
            <div className="absolute bottom-0 right-0 w-20 h-20 flex items-end justify-end gap-0.5 p-4 opacity-10">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-slate-900"
                  style={{ height: `${30 + ((i + 1) % 3) * 20}%` }}
                />
              ))}
            </div>

            <div className="relative max-w-2xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-5xl font-extrabold mb-5 tracking-tight leading-[1.1] text-slate-900">
                Berhenti main tebak-tebakan.
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10 text-accent-500">
                    Mulai catat dengan rapi.
                  </span>
                  <span className="absolute bottom-1 left-0 right-0 h-3 bg-accent-200/60 -z-0" />
                </span>
              </h2>

              <p className="text-slate-600 mb-8 text-base max-w-lg mx-auto leading-relaxed">
                Coba Cashier gratis 14 hari. Tanpa kartu kredit. Batalkan kapan
                saja.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                <Link href="/register">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-bold px-8 py-4 rounded-full shadow-xl shadow-accent-500/30 transition-colors"
                  >
                    Mulai Gratis 14 Hari
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>

                <a href={WA_LINK} target="_blank" rel="noreferrer">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-900 font-bold px-8 py-4 rounded-full border-2 border-slate-200 hover:border-green-500 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5 text-green-600" />
                    Chat via WhatsApp
                  </motion.button>
                </a>
              </div>

              <a
                href={WA_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Atau jadwalkan demo 15 menit
              </a>

              <div className="my-8 flex items-center justify-center gap-3">
                <div className="h-px bg-slate-200 w-16" />
                <div className="text-xs text-slate-400">atau</div>
                <div className="h-px bg-slate-200 w-16" />
              </div>

              <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="text-green-600 font-bold">✓</span> Tanpa
                  kartu kredit
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-green-600 font-bold">✓</span> Setup 5
                  menit
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-green-600 font-bold">✓</span> Batalkan
                  kapan saja
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}