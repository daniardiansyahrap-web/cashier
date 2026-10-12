"use client";

import { motion } from "framer-motion";

// TODO: Ganti dengan nama toko real setelah ada user
const tokoPlaceholder = [
  "Warung Bu Sari",
  "Toko Berkah",
  "Minimarket Maju",
  "Kafe Kopi Pagi",
  "Apotek Sehat",
  "Toko Bangunan Jaya",
];

export function SocialProof() {
  return (
    <section className="relative bg-white py-10 md:py-14 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <p className="text-center text-xs md:text-sm text-slate-500 font-medium mb-6 uppercase tracking-widest">
          {/* TODO: Ganti dengan angka real setelah ada user */}
          Sedang dikembangkan bersama UMKM Indonesia
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 opacity-60">
          {tokoPlaceholder.map((toko, idx) => (
            <motion.span
              key={toko}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-sm md:text-base font-semibold text-slate-700"
            >
              {toko}
            </motion.span>
          ))}
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-4">
          {/* TODO: Hapus setelah ada testimoni real */}
          *Placeholder — akan diganti dengan toko real
        </p>
      </div>
    </section>
  );
}