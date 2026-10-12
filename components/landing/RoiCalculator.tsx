"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, TrendingUp, Wallet } from "lucide-react";
import Link from "next/link";

export function RoiCalculator() {
  const [transaksiPerHari, setTransaksiPerHari] = useState(50);
  const [menitPerTransaksi, setMenitPerTransaksi] = useState(2);
  const [gajiPerJam, setGajiPerJam] = useState(20000);

  const hasil = useMemo(() => {
    const hariKerjaPerBulan = 26;
    const menitPerBulan = transaksiPerHari * menitPerTransaksi * hariKerjaPerBulan;
    const jamPerBulan = menitPerBulan / 60;
    // Asumsi Cashier hemat 70% waktu pencatatan (scan barcode + auto-record)
    const jamHemat = jamPerBulan * 0.7;
    const rupiahHemat = jamHemat * gajiPerJam;
    return {
      jamPerBulan: Math.round(jamHemat),
      rupiahPerBulan: Math.round(rupiahHemat / 1000) * 1000,
    };
  }, [transaksiPerHari, menitPerTransaksi, gajiPerJam]);

  function formatRupiah(angka: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  }

  return (
    <section
      id="kalkulator"
      className="relative py-20 md:py-28 px-4 bg-slate-950 text-white overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-brand-950 to-slate-950" />
      <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 -right-40 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-[120px]" />

      {/* Barcode pattern subtle */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
        <div className="flex items-end gap-1 h-full w-full justify-center px-8">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="w-1 bg-white"
              style={{ height: `${20 + (i % 5) * 15}%` }}
            />
          ))}
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-accent-500 rounded-full animate-pulse" />
            Kalkulator Hemat
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Berapa waktu yang bisa{" "}
            <span className="text-accent-400">kamu selamatkan?</span>
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Input kondisi toko kamu, lihat estimasi waktu & uang yang bisa
            dihemat per bulan dengan Cashier.
          </p>
        </div>

        {/* Layout 2 kolom: Input kiri, Output kanan */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">
          {/* INPUT */}
          <div className="lg:col-span-3 bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6 md:p-8">
            <h3 className="font-display text-xl font-bold mb-6">
              Kondisi Toko Kamu
            </h3>

            {/* Input 1 */}
            <div className="mb-6">
              <label className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-300">
                  Transaksi per hari
                </span>
                <span className="font-display font-bold text-2xl text-white">
                  {transaksiPerHari}
                </span>
              </label>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={transaksiPerHari}
                onChange={(e) => setTransaksiPerHari(Number(e.target.value))}
                className="w-full accent-accent-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>10</span>
                <span>500+</span>
              </div>
            </div>

            {/* Input 2 */}
            <div className="mb-6">
              <label className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-300">
                  Menit catat manual per transaksi
                </span>
                <span className="font-display font-bold text-2xl text-white">
                  {menitPerTransaksi} <span className="text-sm">menit</span>
                </span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={menitPerTransaksi}
                onChange={(e) =>
                  setMenitPerTransaksi(Number(e.target.value))
                }
                className="w-full accent-accent-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>1 menit</span>
                <span>10 menit</span>
              </div>
            </div>

            {/* Input 3 */}
            <div>
              <label className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-300">
                  Nilai waktu kamu (per jam)
                </span>
                <span className="font-display font-bold text-2xl text-white">
                  {formatRupiah(gajiPerJam)}
                </span>
              </label>
              <input
                type="range"
                min="10000"
                max="100000"
                step="5000"
                value={gajiPerJam}
                onChange={(e) => setGajiPerJam(Number(e.target.value))}
                className="w-full accent-accent-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Rp 10rb</span>
                <span>Rp 100rb</span>
              </div>
            </div>

            {/* Asumsi */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-[10px] text-slate-500 leading-relaxed">
                *Asumsi: 26 hari kerja/bulan. Cashier hemat ~70% waktu
                pencatatan manual (scan barcode + auto-record). Angka ini
                estimasi, hasil nyata bisa berbeda.
              </p>
            </div>
          </div>

          {/* OUTPUT */}
          <div className="lg:col-span-2 bg-gradient-to-br from-accent-500 to-accent-600 rounded-3xl p-6 md:p-8 text-white shadow-2xl shadow-accent-500/30 sticky top-24">
            <h3 className="font-display text-xl font-bold mb-6">
              Estimasi Hemat
            </h3>

            <div className="space-y-6">
              {/* Jam hemat */}
              <div>
                <div className="flex items-center gap-2 text-white/80 text-xs mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  Waktu terhemat
                </div>
                <div className="flex items-baseline gap-2">
                  <motion.span
                    key={hasil.jamPerBulan}
                    initial={{ scale: 1.15, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="font-display text-5xl md:text-6xl font-extrabold"
                  >
                    {hasil.jamPerBulan}
                  </motion.span>
                  <span className="text-lg font-medium opacity-80">
                    jam/bulan
                  </span>
                </div>
              </div>

              {/* Rupiah */}
              <div className="pt-4 border-t border-white/20">
                <div className="flex items-center gap-2 text-white/80 text-xs mb-1">
                  <Wallet className="w-3.5 h-3.5" />
                  Setara nilai uang
                </div>
                <motion.div
                  key={hasil.rupiahPerBulan}
                  initial={{ scale: 1.15, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="font-display text-3xl md:text-4xl font-extrabold"
                >
                  {formatRupiah(hasil.rupiahPerBulan)}
                </motion.div>
                <p className="text-xs opacity-70 mt-1">per bulan</p>
              </div>

              {/* Setara */}
              <div className="bg-white/10 rounded-xl p-3 text-xs leading-relaxed">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                Setara{" "}
                <span className="font-bold">
                  {(hasil.rupiahPerBulan / 99000).toFixed(1)}x
                </span>{" "}
                biaya langganan Basic.
              </div>

              {/* CTA */}
              <Link href="/register" className="block">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white text-accent-600 font-bold py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  Mulai Gratis 14 Hari →
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}