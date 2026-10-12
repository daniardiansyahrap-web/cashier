"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { paket } from "@/lib/landing-data";

export function Pricing() {
  const [tahunan, setTahunan] = useState(false);
  const [showCompare, setShowCompare] = useState(false);

  function formatRupiah(angka: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  }

  return (
    <section id="harga" className="relative py-20 md:py-28 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-accent-500 rounded-full animate-pulse" />
            Harga
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-slate-900">
            Harga jujur, gak ada biaya tersembunyi
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Semua paket gratis 14 hari. Tanpa kartu kredit. Batalkan kapan
            saja.
          </p>
        </div>

        {/* Toggle Bulanan/Tahunan */}
        <div className="flex justify-center items-center gap-3 mb-12">
          <span
            className={`text-sm font-semibold transition-colors ${
              !tahunan ? "text-slate-900" : "text-slate-400"
            }`}
          >
            Bulanan
          </span>
          <button
            onClick={() => setTahunan(!tahunan)}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              tahunan ? "bg-accent-500" : "bg-slate-300"
            }`}
            aria-label="Toggle tahunan"
          >
            <motion.div
              animate={{ x: tahunan ? 24 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
            />
          </button>
          <span
            className={`text-sm font-semibold transition-colors flex items-center gap-2 ${
              tahunan ? "text-slate-900" : "text-slate-400"
            }`}
          >
            Tahunan
            <span className="bg-accent-50 text-accent-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              HEMAT 2 BULAN
            </span>
          </span>
        </div>

        {/* Kartu Paket */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {paket.map((p, idx) => {
            const harga = tahunan ? p.hargaTahunan : p.hargaBulanan;
            const isPopuler = p.populer;

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative flex flex-col rounded-3xl p-6 md:p-8 transition-all ${
                  isPopuler
                    ? "bg-slate-900 text-white shadow-2xl shadow-slate-900/30 md:scale-105 z-10"
                    : "bg-white border-2 border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* Badge Populer */}
                {isPopuler && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-accent-500/30">
                    PALING POPULER
                  </div>
                )}

                {/* Nama & Deskripsi */}
                <div className="mb-6">
                  <h3
                    className={`font-display text-2xl font-bold mb-1 ${
                      isPopuler ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {p.nama}
                  </h3>
                  <p
                    className={`text-sm ${
                      isPopuler ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {p.deskripsi}
                  </p>
                </div>

                {/* Harga */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`font-display text-4xl font-extrabold ${
                        isPopuler ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {formatRupiah(harga)}
                    </span>
                    <span
                      className={`text-sm ${
                        isPopuler ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      /bulan
                    </span>
                  </div>
                  {tahunan && (
                    <p
                      className={`text-xs mt-1 ${
                        isPopuler ? "text-accent-400" : "text-accent-600"
                      }`}
                    >
                      Ditagih tahunan · hemat{" "}
                      {formatRupiah(
                        (p.hargaBulanan - p.hargaTahunan) * 12
                      )}
                      /tahun
                    </p>
                  )}
                </div>

                {/* Fitur */}
                <ul className="space-y-3 mb-6 flex-1">
                  {p.fitur.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          isPopuler ? "text-accent-400" : "text-green-600"
                        }`}
                        strokeWidth={3}
                      />
                      <span
                        className={isPopuler ? "text-slate-300" : "text-slate-700"}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                  {p.belumTermasuk?.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm opacity-50"
                    >
                      <X
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          isPopuler ? "text-slate-600" : "text-slate-400"
                        }`}
                        strokeWidth={3}
                      />
                      <span
                        className={`line-through ${
                          isPopuler ? "text-slate-500" : "text-slate-500"
                        }`}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link href="/register">
                  <button
                    className={`w-full py-3.5 rounded-full font-bold text-sm transition-all ${
                      isPopuler
                        ? "bg-accent-500 hover:bg-accent-600 text-white shadow-lg shadow-accent-500/30"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                  >
                    Mulai Gratis 14 Hari
                  </button>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Catatan */}
        <p className="text-center text-xs text-slate-500 mt-8">
          Semua paket gratis 14 hari. Tanpa kartu kredit. Batalkan kapan saja.
        </p>

        {/* Accordion: Tabel Perbandingan */}
        <div className="mt-16 max-w-4xl mx-auto">
          <button
            onClick={() => setShowCompare(!showCompare)}
            className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl p-5 transition-colors"
          >
            <span className="font-display font-bold text-slate-900 text-left">
              Bandingkan paket secara detail
            </span>
            <ChevronDown
              className={`w-5 h-5 text-slate-500 transition-transform ${
                showCompare ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {showCompare && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 bg-white border border-slate-200 rounded-2xl overflow-x-auto">
                  <table className="w-full text-sm min-w-[600px]">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left p-4 font-semibold text-slate-700 sticky left-0 bg-slate-50">
                          Fitur
                        </th>
                        <th className="text-center p-4 font-semibold text-slate-700">
                          Basic
                        </th>
                        <th className="text-center p-4 font-semibold text-slate-700 bg-accent-50/50">
                          Pro
                        </th>
                        <th className="text-center p-4 font-semibold text-slate-700">
                          Business
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { fitur: "Jumlah outlet", basic: "1", pro: "3", bisnis: "10" },
                        { fitur: "Jumlah user", basic: "2", pro: "5", bisnis: "20" },
                        { fitur: "Jumlah produk", basic: "500", pro: "2.000", bisnis: "Unlimited" },
                        { fitur: "POS + Barcode", basic: true, pro: true, bisnis: true },
                        { fitur: "Laporan dasar", basic: true, pro: true, bisnis: true },
                        { fitur: "Export CSV", basic: false, pro: true, bisnis: true },
                        { fitur: "Manajemen stok lengkap", basic: false, pro: true, bisnis: true },
                        { fitur: "Transfer stok antar outlet", basic: false, pro: false, bisnis: true },
                        { fitur: "Laporan per outlet", basic: false, pro: false, bisnis: true },
                        { fitur: "Support", basic: "Email", pro: "WhatsApp", bisnis: "Prioritas" },
                      ].map((row, i) => (
                        <tr
                          key={i}
                          className="border-b border-slate-100 last:border-0"
                        >
                          <td className="p-4 text-slate-700 font-medium sticky left-0 bg-white">
                            {row.fitur}
                          </td>
                          <td className="p-4 text-center text-slate-600">
                            {typeof row.basic === "boolean" ? (
                              row.basic ? (
                                <Check className="w-4 h-4 text-green-600 mx-auto" strokeWidth={3} />
                              ) : (
                                <X className="w-4 h-4 text-slate-300 mx-auto" strokeWidth={3} />
                              )
                            ) : (
                              row.basic
                            )}
                          </td>
                          <td className="p-4 text-center text-slate-700 font-medium bg-accent-50/30">
                            {typeof row.pro === "boolean" ? (
                              row.pro ? (
                                <Check className="w-4 h-4 text-accent-600 mx-auto" strokeWidth={3} />
                              ) : (
                                <X className="w-4 h-4 text-slate-300 mx-auto" strokeWidth={3} />
                              )
                            ) : (
                              row.pro
                            )}
                          </td>
                          <td className="p-4 text-center text-slate-600">
                            {typeof row.bisnis === "boolean" ? (
                              row.bisnis ? (
                                <Check className="w-4 h-4 text-green-600 mx-auto" strokeWidth={3} />
                              ) : (
                                <X className="w-4 h-4 text-slate-300 mx-auto" strokeWidth={3} />
                              )
                            ) : (
                              row.bisnis
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}