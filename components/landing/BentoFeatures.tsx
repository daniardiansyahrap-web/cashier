"use client";

import { motion } from "framer-motion";
import { PosMockup } from "./mockups/PosMockup";
import {
  ShoppingCart,
  ScanBarcode,
  BarChart3,
  Store,
  Package,
  Warehouse,
  Receipt,
  ArrowRight,
} from "lucide-react";

export function BentoFeatures() {
  return (
    <section
      id="fitur"
      className="relative py-20 md:py-28 px-4 bg-gradient-to-b from-white via-slate-50 to-white"
    >
      {/* Background dots */}
      <div
        className="absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #cbd5e1 0.5px, transparent 0.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16">
         
          <h2 className="font-display text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-slate-900">
            Satu aplikasi untuk{" "}
            <span className="text-accent-500">seluruh toko kamu</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Dari kasir sampai laporan, semuanya terintegrasi.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 md:gap-5">
          {/* KARTU BESAR: POS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-6 lg:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/40 overflow-hidden group hover:shadow-2xl transition-all duration-500"
          >
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <ShoppingCart className="w-6 h-6" strokeWidth={2.5} />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-2 text-slate-900">
                    Kasir Cepat (POS)
                  </h3>
                  <p className="text-slate-600 text-sm max-w-md">
                    Transaksi &lt; 10 detik. Scan barcode langsung masuk
                    keranjang, hitung otomatis, langsung bayar.
                  </p>
                </div>
              </div>
            </div>
            {/* Mockup POS preview */}
            <div className="mx-6 mb-6 md:mx-8 md:mb-8 rounded-2xl border border-slate-100 overflow-hidden bg-slate-50 aspect-[16/9]">
              <PosMockup />
            </div>
          </motion.div>

          {/* KARTU SEDANG: Barcode */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-3 lg:col-span-5 bg-gradient-to-br from-slate-900 to-brand-900 rounded-3xl border border-slate-800 shadow-lg overflow-hidden relative group hover:shadow-2xl transition-all duration-500 text-white p-6 md:p-8"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ScanBarcode className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <h3 className="font-display text-2xl font-bold mb-2">
                Barcode Scanner
              </h3>
              <p className="text-slate-300 text-sm mb-6 max-w-sm">
                Scan pakai kamera HP atau scanner USB. Produk otomatis masuk
                keranjang.
              </p>

              {/* Animasi scan */}
              <div className="relative h-24 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
                <div className="flex items-end gap-1 opacity-40">
                  {[3, 7, 2, 8, 4, 6, 2, 7, 3, 5, 8, 2, 6, 4, 7, 3, 5].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="w-1 bg-white rounded"
                        style={{ height: `${h * 3}px` }}
                      />
                    )
                  )}
                </div>
                <motion.div
                  className="absolute left-0 right-0 h-0.5 bg-accent-400 shadow-lg shadow-accent-400/50"
                  animate={{ top: ["10%", "90%", "10%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>
          </motion.div>

          {/* KARTU SEDANG: Laporan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-3 lg:col-span-4 bg-white rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/40 p-6 md:p-8 group hover:shadow-2xl transition-all duration-500"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <h3 className="font-display text-2xl font-bold mb-2 text-slate-900">
              Laporan Lengkap
            </h3>
            <p className="text-slate-600 text-sm mb-6">
              Penjualan, produk terlaris, per metode bayar. Export CSV.
            </p>

            {/* Mini chart */}
            <div className="flex items-end gap-1 h-20 mb-4">
              {[40, 65, 30, 80, 55, 90, 70].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex-1 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t"
                />
              ))}
            </div>
            <button className="text-xs font-semibold text-cyan-600 flex items-center gap-1 hover:gap-2 transition-all">
              Export CSV <ArrowRight className="w-3 h-3" />
            </button>
          </motion.div>

          {/* KARTU KECIL: Multi-Outlet */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2 lg:col-span-4 bg-white rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/40 p-6 group hover:shadow-2xl transition-all duration-500"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Store className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <h3 className="font-display text-xl font-bold mb-2 text-slate-900">
              Multi-Outlet
            </h3>
            <p className="text-slate-600 text-sm mb-4">
              Kelola banyak cabang. Transfer stok antar outlet.
            </p>

            {/* Mini outlets */}
            <div className="space-y-1.5">
              {[
                { nama: "Cabang Pusat", stok: "Aman", color: "green" },
                { nama: "Cabang Timur", stok: "Aman", color: "green" },
                { nama: "Cabang Barat", stok: "Menipis", color: "orange" },
              ].map((c) => (
                <div
                  key={c.nama}
                  className="flex items-center justify-between text-xs bg-slate-50 rounded-lg px-3 py-2"
                >
                  <span className="font-medium text-slate-700">{c.nama}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      c.color === "green"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {c.stok}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* KARTU KECIL: Stok */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="md:col-span-2 lg:col-span-4 bg-white rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/40 p-6 group hover:shadow-2xl transition-all duration-500"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Warehouse className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <h3 className="font-display text-xl font-bold mb-2 text-slate-900">
              Manajemen Stok
            </h3>
            <p className="text-slate-600 text-sm mb-4">
              Stok masuk, keluar, opname. Highlight stok menipis.
            </p>

            {/* Mini stok list */}
            <div className="space-y-1.5">
              {[
                { nama: "Indomie Goreng", qty: 3, low: true },
                { nama: "Teh Botol", qty: 45, low: false },
                { nama: "Kopi Kapal", qty: 8, low: true },
              ].map((p) => (
                <div
                  key={p.nama}
                  className="flex items-center justify-between text-xs bg-slate-50 rounded-lg px-3 py-2"
                >
                  <span className="font-medium text-slate-700">{p.nama}</span>
                  <span
                    className={`font-bold ${
                      p.low ? "text-orange-600" : "text-slate-600"
                    }`}
                  >
                    {p.qty}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* KARTU KECIL: Cetak Struk (Segera Hadir) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="md:col-span-6 lg:col-span-12 bg-white rounded-3xl border border-dashed border-slate-200 p-6 md:p-8 group hover:border-orange-300 transition-all duration-500 relative"
          >
            <div className="absolute top-4 right-4 bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-1 rounded-full">
              SEGERA HADIR
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mb-4">
              <Receipt className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <h3 className="font-display text-xl font-bold mb-2 text-slate-900">
              Cetak Struk Thermal
            </h3>
            <p className="text-slate-600 text-sm">
              Print struk ke printer thermal Bluetooth. Sedang dikembangkan.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}