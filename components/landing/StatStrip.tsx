"use client";

import { motion } from "framer-motion";

const items = [
  {
    judul: "Gratis 14 hari",
    deskripsi: "Tanpa kartu kredit",
  },
  {
    judul: "Setup 5 menit",
    deskripsi: "Tanpa instalasi rumit",
  },
  {
    judul: "HP, tablet, PC",
    deskripsi: "Android, Windows, web",
  },
  {
    judul: "Bantuan WhatsApp",
    deskripsi: "Dibantu sampai jalan",
  },
];

export function StatStrip() {
  return (
    <section className="relative text-slate-900">
      {/* ATAS: Layout 2 kolom */}
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* KIRI: Judul */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight">
              Coba dulu,baru putuskan.{" "}
            </h2>
            <p className="text-slate-600 mt-4 text-sm md:text-base max-w-sm">
              Gak ada komitmen. Batalkan kapan saja. Tanpa biaya tersembunyi.
            </p>
          </motion.div>

          {/* KANAN: 4 item grid 2x2 */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
            {items.map((item, idx) => (
              <motion.div
                key={item.judul}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="border-t border-slate-200 pt-5"
              >
                <div className="font-display font-bold text-base md:text-lg text-slate-900 mb-1">
                  {item.judul}
                </div>
                  <div className="text-sm text-slate-600">
                  {item.deskripsi}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
    </section>
  );
}