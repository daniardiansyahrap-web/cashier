"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, Check, TrendingUp } from "lucide-react";
import { PosMockup } from "./mockups/PosMockup";
import { ReceiptMockup } from "./mockups/ReceiptMockup";

export function Hero() {
  return (
    <section className="relative min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Background gradient + aurora */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-brand-950 to-slate-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-[120px]" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-32 md:pt-40 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* KIRI: Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="text-xs md:text-sm font-medium">
                Gratis 14 hari · Tanpa kartu kredit
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
              Tutup toko,{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-accent-400">
                  omzet hari ini sudah rapi
                </span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-accent-500/20 -z-0" />
              </span>{" "}
              di HP kamu.
            </h1>

            {/* Sub */}
            <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-8 max-w-lg">
              Kasir, stok, dan laporan dalam satu aplikasi. Setup 5 menit,
              langsung bisa dipakai.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-7 py-4 rounded-full shadow-xl shadow-accent-500/30 transition-colors"
                >
                  Coba Gratis 14 Hari
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <a href="#demo">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 text-white font-semibold px-7 py-4 rounded-full transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Lihat Demo
                </motion.button>
              </a>
            </div>

            {/* Trust line */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs md:text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-accent-400" />
                Tanpa kartu kredit
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-accent-400" />
                Setup 5 menit
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-accent-400" />
                Bisa dari HP
              </span>
            </div>
          </motion.div>

          {/* KANAN: Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Laptop Mockup */}
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Laptop Frame */}
              <div className="bg-slate-800 rounded-t-xl p-2 pb-0 shadow-2xl">
                <div className="bg-slate-900 rounded-t-lg p-1.5 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500/60" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                  <div className="w-2 h-2 rounded-full bg-green-500/60" />
                </div>
                <div className="aspect-[4/3] bg-slate-50 rounded-t-md overflow-hidden">
                  <PosMockup />
                </div>
              </div>
              {/* Laptop Base */}
              <div className="bg-slate-700 h-3 rounded-b-xl mx-[-8px]" />
              <div className="bg-slate-600 h-1.5 rounded-b-2xl mx-[-16px]" />
            </div>

            {/* Struk Melayang */}
            <div className="absolute -top-12 -right-4 md:-right-8 hidden md:block">
              <ReceiptMockup />
            </div>

            {/* Notifikasi Floating */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="absolute -left-4 top-1/4 bg-white rounded-xl shadow-2xl p-3 hidden md:flex items-center gap-2 border border-slate-100"
            >
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500">
                  Penjualan hari ini
                </div>
                <div className="text-sm font-bold text-slate-900">
                  Rp 2.450.000
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              className="absolute -right-4 bottom-1/4 bg-white rounded-xl shadow-2xl p-3 hidden md:flex items-center gap-2 border border-slate-100"
            >
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-sm">
                ⚠️
              </div>
              <div>
                <div className="text-[10px] text-slate-500">Stok menipis</div>
                <div className="text-xs font-bold text-slate-900">
                  Indomie Goreng
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}