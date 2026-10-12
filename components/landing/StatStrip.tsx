"use client";

import { motion } from "framer-motion";
import { stats } from "@/lib/landing-data";

export function StatStrip() {
  return (
    <section className="relative bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((s, idx) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center"
            >
              <div className="font-display text-4xl md:text-5xl font-extrabold text-brand-700 mb-1">
                {s.angka.toLocaleString("id-ID")}
                <span className="text-2xl md:text-3xl text-brand-500">
                  {s.suffix}
                </span>
              </div>
              <div className="text-xs md:text-sm text-slate-500 font-medium">
                {s.label}
                {s.todo && (
                  <span className="ml-1 text-[10px] text-orange-500">
                    (TODO)
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}