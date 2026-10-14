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
    const menitPerBulan =
      transaksiPerHari * menitPerTransaksi * hariKerjaPerBulan;
    const jamPerBulan = menitPerBulan / 60;
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

  // Hexagon horizontal dengan sudut lancip yang lebih tipis.
  const clipPath =
    "polygon(0 7%, 50% 0%, 100% 7%, 100% 93%, 50% 100%, 0 93%)";

  return (
    <section
      id="kalkulator"
      className="relative py-20 md:py-28 bg-slate-100 overflow-hidden"
    >
      {/* Dots pattern bg */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #94a3b8 0.5px, transparent 0.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative w-full">
        {/* GLOW DI BELAKANG */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-accent-500 via-brand-500 to-cyan-500 blur-3xl opacity-25"
          style={{ clipPath }}
        />

        {/* CARD NAVY HEXAGON */}
        <div
          className="relative bg-slate-950 text-white shadow-2xl shadow-slate-900/30 overflow-hidden"
          style={{ clipPath }}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-brand-950 to-slate-950" />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Glow orbs */}
          <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-brand-500/25 rounded-full blur-[140px]" />
          <div className="absolute -bottom-32 right-1/4 w-[600px] h-[600px] bg-accent-500/20 rounded-full blur-[140px]" />

          {/* Barcode pattern bawah */}
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1 px-8 pb-12 opacity-[0.05]">
            {Array.from({ length: 120 }).map((_, i) => (
              <div
                key={i}
                className="w-1 bg-white"
                style={{ height: `${20 + (i % 6) * 14}%` }}
              />
            ))}
          </div>

          {/* Content — lebar dipendekin + padding atas-bawah gede */}
          <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-24 lg:py-28">
            {/* Header */}
            <div className="text-left mb-10 max-w-4xl">
              <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight">
                Berapa waktu yang bisa{" "}
                <span className="text-accent-400">
                  kamu selamatkan?
                </span>
              </h2>
              <p className="text-slate-300 max-w-2xl text-base md:text-lg">
                Input kondisi toko kamu, lihat estimasi waktu & uang yang bisa
                dihemat per bulan.
              </p>
            </div>

            {/* Layout 2 kolom — grid lebih rapat */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start max-w-5xl mx-auto">
              {/* INPUT */}
              <div className="lg:col-span-3 bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6 md:p-10">
                <h3 className="font-display text-xl md:text-2xl font-bold mb-8">
                  Kondisi Toko Kamu
                </h3>

                <div className="mb-8">
                  <label className="flex justify-between items-center mb-3">
                    <span className="text-sm md:text-base text-slate-300">
                      Transaksi per hari
                    </span>
                    <span className="font-display font-bold text-3xl text-white">
                      {transaksiPerHari}
                    </span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    value={transaksiPerHari}
                    onChange={(e) =>
                      setTransaksiPerHari(Number(e.target.value))
                    }
                    className="w-full accent-accent-500 cursor-pointer h-2"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>10</span>
                    <span>500+</span>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="flex justify-between items-center mb-3">
                    <span className="text-sm md:text-base text-slate-300">
                      Menit catat manual per transaksi
                    </span>
                    <span className="font-display font-bold text-3xl text-white">
                      {menitPerTransaksi} menit
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
                    className="w-full accent-accent-500 cursor-pointer h-2"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>1 menit</span>
                    <span>10 menit</span>
                  </div>
                </div>

                <div>
                  <label className="flex justify-between items-center mb-3">
                    <span className="text-sm md:text-base text-slate-300">
                      Nilai waktu kamu (per jam)
                    </span>
                    <span className="font-display font-bold text-3xl text-white">
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
                    className="w-full accent-accent-500 cursor-pointer h-2"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>Rp 10rb</span>
                    <span>Rp 100rb</span>
                  </div>
                </div>

                <p className="text-[10px] md:text-xs text-slate-500 mt-8 pt-6 border-t border-white/10 leading-relaxed">
                  *Asumsi: 26 hari kerja/bulan. Cashier hemat ~70% waktu
                  pencatatan manual (scan barcode + auto-record). Angka ini
                  estimasi, hasil nyata bisa berbeda.
                </p>
              </div>

              {/* OUTPUT */}
              <div className="lg:col-span-2 bg-gradient-to-br from-accent-500 to-accent-600 rounded-3xl p-6 md:p-10 shadow-2xl shadow-accent-500/30">
                <h3 className="font-display text-xl md:text-2xl font-bold mb-8">
                  Estimasi Hemat
                </h3>

                <div className="space-y-8">
                  <div>
                    <div className="flex items-center gap-2 text-white/80 text-xs md:text-sm mb-2">
                      <Clock className="w-4 h-4" />
                      Waktu terhemat
                    </div>
                    <div className="flex items-baseline gap-2">
                      <motion.span
                        key={hasil.jamPerBulan}
                        initial={{ scale: 1.15, opacity: 0.7 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="font-display text-6xl md:text-7xl font-extrabold"
                      >
                        {hasil.jamPerBulan}
                      </motion.span>
                      <span className="text-lg md:text-xl opacity-80">
                        jam/bulan
                      </span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/20">
                    <div className="flex items-center gap-2 text-white/80 text-xs md:text-sm mb-2">
                      <Wallet className="w-4 h-4" />
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
                    <p className="text-xs md:text-sm opacity-70 mt-1">
                      per bulan
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4 text-xs md:text-sm">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    Setara{" "}
                    <span className="font-bold">
                      {(hasil.rupiahPerBulan / 99000).toFixed(1)}x
                    </span>{" "}
                    biaya langganan Basic.
                  </div>

                  <Link href="/register" className="block">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-white text-accent-600 font-bold py-4 rounded-full shadow-lg hover:shadow-xl transition-all text-sm md:text-base"
                    >
                      Mulai Gratis 14 Hari →
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}