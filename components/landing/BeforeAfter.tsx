"use client";

import { motion } from "framer-motion";
import { X, Check, BookOpen, Calculator, Pencil, Moon, AlertCircle, Smartphone, Zap, Database, Clock, Shield } from "lucide-react";

const caraLama = [
  {
    icon: BookOpen,
    text: "Catat penjualan di buku nota",
  },
  {
    icon: Calculator,
    text: "Hitung manual pakai kalkulator — sering salah",
  },
  {
    icon: Pencil,
    text: "Stok dicatat terpisah, sering lupa update",
  },
  {
    icon: Moon,
    text: "Rekap harian manual, baru kelar tengah malam",
  },
  {
    icon: AlertCircle,
    text: "Selisih kas & stok ketemu besoknya",
  },
];

const denganCashier = [
  {
    icon: Zap,
    text: "Transaksi < 10 detik dengan barcode",
  },
  {
    icon: Smartphone,
    text: "Total & kembalian dihitung otomatis",
  },
  {
    icon: Database,
    text: "Stok berkurang otomatis setiap transaksi",
  },
  {
    icon: Clock,
    text: "Laporan harian real-time, tinggal buka HP",
  },
  {
    icon: Shield,
    text: "Audit log lengkap, gak ada selisih",
  },
];

export function BeforeAfter() {
  return (
    <section className="relative py-20 md:py-28 px-4 bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          
          <h2 className="font-display text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-slate-900">
            Sebelum &{" "}
            <span className="text-accent-500">sesudah pakai Cashier</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Bandingkan cara lama dengan cara baru. Kamu bakal sadar, banyak
            waktu yang bisa diselamatkan.
          </p>
        </div>

        {/* 2 Kolom */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* KIRI: Cara Lama */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative bg-amber-50/50 rounded-3xl border-2 border-amber-100 p-8 overflow-hidden"
          >
            {/* Paper texture effect */}
            <div
              className="absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #d97706 0.5px, transparent 0.5px)",
                backgroundSize: "16px 16px",
              }}
            />

            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-200/70 text-amber-700 flex items-center justify-center">
                  <X className="w-6 h-6" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-amber-900">
                    Cara Lama
                  </h3>
                  <p className="text-sm text-amber-700/70">
                    Buku nota, kalkulator, & ingatan
                  </p>
                </div>
              </div>

              <ul className="space-y-4">
                {caraLama.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-amber-100/70 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-amber-600" />
                      </div>
                      <span className="text-amber-900/80 pt-1">
                        {item.text}
                      </span>
                    </motion.li>
                  );
                })}
              </ul>

              {/* Label bawah */}
              <div className="mt-8 pt-6 border-t border-amber-200/50">
                <p className="text-xs text-amber-700/60 italic">
                  Hasil: capek, sering salah, waktu habis buat rekap
                </p>
              </div>
            </div>
          </motion.div>

          {/* KANAN: Dengan Cashier */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 rounded-3xl border-2 border-brand-700 p-8 overflow-hidden text-white"
          >
            {/* Glow */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur text-white flex items-center justify-center">
                  <Check className="w-6 h-6" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold">
                    Dengan Cashier
                  </h3>
                  <p className="text-sm text-white/70">
                    Otomatis, cepat, akurat
                  </p>
                </div>
              </div>

              <ul className="space-y-4">
                {denganCashier.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-accent-500/20 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-accent-400" />
                      </div>
                      <span className="text-white/90 pt-1">{item.text}</span>
                    </motion.li>
                  );
                })}
              </ul>

              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-xs text-white/60 italic">
                  Hasil: hemat waktu, akurat, kepala ringan
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}