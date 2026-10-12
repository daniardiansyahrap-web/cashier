"use client";

import { motion } from "framer-motion";
import { Zap, Smartphone, ShieldCheck } from "lucide-react";

const alasan = [
  {
    nomor: "01",
    icon: Zap,
    judul: "Setup 5 menit, langsung jualan",
    deskripsi:
      "Daftar akun, tambah produk pertama, dan mulai terima transaksi. Tanpa training, tanpa onboarding ribet.",
    highlight: "Tanpa install",
  },
  {
    nomor: "02",
    icon: Smartphone,
    judul: "Buka dari HP, tablet, atau komputer",
    deskripsi:
      "Berbasis cloud. Data selalu sinkron. Pantau toko dari mana saja — bahkan sambil rebahan.",
    highlight: "Akses 24/7",
  },
  {
    nomor: "03",
    icon: ShieldCheck,
    judul: "Data kamu, tanggung jawab kami",
    deskripsi:
      "Terenkripsi, backup harian otomatis, dan audit log lengkap. Fokus jualan, bukan mikirin data hilang.",
    highlight: "Backup otomatis",
  },
];

export function KenapaKami() {
  return (
    <section className="relative py-20 md:py-28 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header dengan layout beda — kiri-aligned */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 mb-16 items-end">
          <div className="md:col-span-7">
            <div className="text-xs font-bold text-accent-600 mb-3 uppercase tracking-widest">
              Keunggulan
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Kenapa banyak toko{" "}
              <span className="relative inline-block">
                <span className="relative z-10">pindah ke Cashier</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-accent-200/60 -z-0" />
              </span>
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-slate-600 leading-relaxed">
              Bukan karena fiturnya paling banyak, tapi karena kami bikin yang
              kamu <span className="font-semibold text-slate-900">benar-benar butuh</span> — cepat, simpel, dan gak bikin ribet.
            </p>
          </div>
        </div>

        {/* List horizontal bernomor — BUKAN grid 3 kartu */}
        <div className="space-y-0">
          {alasan.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.nomor}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group border-t border-slate-200 py-8 md:py-10 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start hover:bg-slate-50/50 transition-colors -mx-4 md:-mx-8 px-4 md:px-8"
              >
                {/* Nomor besar */}
                <div className="md:col-span-2">
                  <div className="font-display text-6xl md:text-7xl font-extrabold text-slate-200 group-hover:text-accent-500 transition-colors leading-none">
                    {item.nomor}
                  </div>
                </div>

                {/* Icon + Judul */}
                <div className="md:col-span-5 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-700 text-white flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                    <Icon className="w-6 h-6" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl md:text-2xl font-bold text-slate-900 mb-1">
                      {item.judul}
                    </h3>
                    <span className="inline-block text-[10px] font-bold text-accent-600 bg-accent-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {item.highlight}
                    </span>
                  </div>
                </div>

                {/* Deskripsi */}
                <div className="md:col-span-5">
                  <p className="text-slate-600 leading-relaxed">
                    {item.deskripsi}
                  </p>
                </div>
              </motion.div>
            );
          })}
          {/* Border penutup */}
          <div className="border-t border-slate-200" />
        </div>
      </div>
    </section>
  );
}