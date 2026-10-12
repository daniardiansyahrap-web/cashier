"use client";

import { motion } from "framer-motion";
import { fiturIndonesia } from "@/lib/landing-data";

export function FiturIndonesia() {
  return (
    <section className="relative py-20 md:py-28 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest shadow-sm">
            <span className="w-1.5 h-1.5 bg-accent-500 rounded-full animate-pulse" />
            Fitur Khas Indonesia
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-slate-900">
            Dibuat untuk <span className="text-accent-500">UMKM Indonesia</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Fitur yang kamu butuh untuk jualan di Indonesia — dari QRIS sampai
            struk WhatsApp.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {fiturIndonesia.map((fitur, idx) => {
            const Icon = fitur.icon;
            const isComingSoon = fitur.badge === "Segera Hadir";
            const isInDevelopment = fitur.badge === "Dalam Pengembangan";

            return (
              <motion.div
                key={fitur.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className={`relative bg-white rounded-2xl border ${
                  isComingSoon
                    ? "border-dashed border-slate-200"
                    : "border-slate-100 shadow-sm hover:shadow-lg hover:border-brand-200"
                } p-5 transition-all duration-300`}
              >
                {/* Badge */}
                {fitur.badge && (
                  <div
                    className={`absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      isComingSoon
                        ? "bg-orange-50 text-orange-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {fitur.badge.toUpperCase()}
                  </div>
                )}

                <div
                  className={`w-10 h-10 rounded-xl ${fitur.color} flex items-center justify-center mb-3`}
                >
                  <Icon className="w-5 h-5" strokeWidth={2.5} />
                </div>

                <h3 className="font-display font-bold text-sm mb-1 text-slate-900 leading-tight">
                  {fitur.judul}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {fitur.deskripsi}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Note */}
        <p className="text-center text-xs text-slate-400 mt-8">
          *Fitur dengan badge "Segera Hadir" sedang dalam pengembangan.
          Kami update secara berkala.
        </p>
      </div>
    </section>
  );
}