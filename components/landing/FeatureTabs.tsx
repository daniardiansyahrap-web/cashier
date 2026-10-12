"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Warehouse, BarChart3, Store, Check } from "lucide-react";

const tabs = [
  {
    id: "kasir",
    label: "Kasir",
    icon: ShoppingCart,
    heading: "Transaksi cepat, gak bikin antre",
    poin: [
      "Scan barcode → produk otomatis masuk keranjang",
      "Hitung total & kembalian otomatis",
      "Multi-metode bayar: tunai, QRIS, debit, transfer",
    ],
  },
  {
    id: "stok",
    label: "Stok",
    icon: Warehouse,
    heading: "Stok akurat, gak ada kejadian barang kosong",
    poin: [
      "Stok otomatis berkurang setiap transaksi",
      "Highlight otomatis saat stok menipis",
      "Riwayat pergerakan stok lengkap (audit log)",
    ],
  },
  {
    id: "laporan",
    label: "Laporan",
    icon: BarChart3,
    heading: "Tutup toko, laporan sudah jadi",
    poin: [
      "Laporan harian, mingguan, bulanan",
      "Produk terlaris & per metode bayar",
      "Export CSV, buka di Excel",
    ],
  },
  {
    id: "outlet",
    label: "Outlet",
    icon: Store,
    heading: "Kelola banyak cabang dari satu HP",
    poin: [
      "Pantau performa setiap outlet",
      "Transfer stok antar outlet",
      "Laporan per outlet",
    ],
  },
];

export function FeatureTabs() {
  const [active, setActive] = useState("kasir");

  const activeTab = tabs.find((t) => t.id === active) || tabs[0];

  return (
    <section className="relative py-20 md:py-28 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-slate-900">
            Lihat Cashier <span className="text-brand-700">beraksi</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Klik tab di bawah untuk lihat bagaimana Cashier bekerja untuk
            kebutuhanmu.
          </p>
        </div>

        {/* Tab Buttons */}
        <div
          role="tablist"
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(tab.id)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-brand-700 text-white shadow-lg shadow-brand-700/30"
                    : "bg-white text-slate-700 border border-slate-200 hover:border-brand-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Kiri: Manfaat */}
            <div className="p-8 md:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-display text-2xl md:text-3xl font-bold mb-6 text-slate-900">
                    {activeTab.heading}
                  </h3>
                  <ul className="space-y-4">
                    {activeTab.poin.map((p, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-6 h-6 rounded-full bg-accent-500/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Check
                            className="w-4 h-4 text-accent-500"
                            strokeWidth={3}
                          />
                        </div>
                        <span className="text-slate-700">{p}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Kanan: Mockup */}
            <div className="bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 p-8 md:p-12 flex items-center justify-center min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-md"
                >
                  {/* Placeholder UI yang berbeda per tab */}
                  <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                      <div className="w-2 h-2 rounded-full bg-yellow-400" />
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <span className="text-white/40 text-xs ml-2">
                        Cashier — {activeTab.label}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 bg-white/10 rounded w-3/4" />
                      <div className="h-3 bg-white/10 rounded w-1/2" />
                      <div className="grid grid-cols-3 gap-2 my-4">
                        <div className="aspect-square bg-accent-500/20 rounded-lg" />
                        <div className="aspect-square bg-brand-500/20 rounded-lg" />
                        <div className="aspect-square bg-cyan-500/20 rounded-lg" />
                      </div>
                      <div className="h-8 bg-accent-500 rounded-lg w-full" />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}