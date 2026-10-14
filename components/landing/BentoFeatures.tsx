"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Pengaturan cepat                                                   */
/* ------------------------------------------------------------------ */
const STORE_NAME = "Hakim Mart"; // nama toko di kepala layar HP
const INTERVAL = 6500; // ms, jeda pergantian otomatis

/* ------------------------------------------------------------------ */
/*  Tipe data                                                          */
/* ------------------------------------------------------------------ */
type Row = { l: string; r: string; warn?: boolean };
type Screen = {
  title: string;
  big: string;
  cap: string;
  rows: Row[];
  btn: string;
};
type Feature = { name: string; desc: string; screen: Screen };

/* ------------------------------------------------------------------ */
/*  Data fitur → isi layar HP                                          */
/* ------------------------------------------------------------------ */
const FEATURES: Feature[] = [
  {
    name: "Kasir Cepat",
    desc: "Transaksi kurang dari 10 detik. Scan, hitung otomatis, langsung bayar.",
    screen: {
      title: "Kasir",
      big: "Rp 12.000",
      cap: "Total transaksi",
      rows: [
        { l: "Indomie Goreng 2×", r: "7.000" },
        { l: "Teh Botol Sosro 1×", r: "5.000" },
        { l: "Tunai", r: "20.000" },
        { l: "Kembali", r: "8.000" },
      ],
      btn: "Bayar",
    },
  },
  {
    name: "Manajemen Produk",
    desc: "Kategori, harga jual dan beli. Atur dengan mudah.",
    screen: {
      title: "Produk",
      big: "124",
      cap: "produk tersimpan",
      rows: [
        { l: "Indomie Goreng", r: "2.700 → 3.500" },
        { l: "Teh Botol Sosro", r: "3.800 → 5.000" },
        { l: "Kopi Kapal Api", r: "1.900 → 2.500" },
        { l: "Roti Tawar", r: "11.500 → 15.000" },
      ],
      btn: "+ Tambah produk",
    },
  },
  {
    name: "Manajemen Stok",
    desc: "Stok masuk dan keluar, opname, serta penanda stok menipis.",
    screen: {
      title: "Stok",
      big: "2",
      cap: "produk hampir habis",
      rows: [
        { l: "Indomie Goreng", r: "sisa 3", warn: true },
        { l: "Kopi Kapal Api", r: "sisa 8", warn: true },
        { l: "Teh Botol Sosro", r: "sisa 45" },
        { l: "Roti Tawar", r: "sisa 22" },
      ],
      btn: "Mulai opname",
    },
  },
  {
    name: "Laporan Usaha",
    desc: "Penjualan, produk terlaris, per metode bayar. Export CSV.",
    screen: {
      title: "Laporan",
      big: "Rp 3.420.000",
      cap: "penjualan hari ini",
      rows: [
        { l: "Transaksi", r: "86" },
        { l: "Terlaris", r: "Indomie Goreng" },
        { l: "Rata-rata", r: "Rp 39.800" },
      ],
      btn: "Export CSV",
    },
  },
  {
    name: "Multi-Outlet",
    desc: "Banyak cabang dalam satu akun. Transfer stok antar outlet.",
    screen: {
      title: "Outlet",
      big: "3",
      cap: "cabang dalam satu akun",
      rows: [
        { l: "Pusat", r: "Rp 1,9 jt" },
        { l: "Timur", r: "Rp 0,9 jt" },
        { l: "Barat", r: "Rp 0,6 jt" },
      ],
      btn: "Transfer stok",
    },
  },
  {
    name: "Barcode Scanner",
    desc: "Pakai kamera HP atau scanner USB. Langsung masuk keranjang.",
    screen: {
      title: "Scan",
      big: "Indomie Goreng",
      cap: "terbaca dari barcode 8991234500012",
      rows: [
        { l: "Harga", r: "3.500" },
        { l: "Stok", r: "3", warn: true },
        { l: "Status", r: "Masuk keranjang" },
      ],
      btn: "Scan lagi",
    },
  },
];

/* ------------------------------------------------------------------ */
/*  PhoneScreen — bingkai HP + isi layar sesuai fitur                  */
/* ------------------------------------------------------------------ */
function bigSize(t: string) {
  if (t.length <= 8) return "text-[34px]";
  if (t.length <= 12) return "text-[28px]";
  return "text-[24px]";
}

function PhoneScreen({ s }: { s: Screen }) {
  return (
    <div className="mx-auto w-[264px] rounded-[36px] border-[1.5px] border-stone-900 bg-white p-3 shadow-[0_26px_40px_-30px_rgba(15,23,42,0.45)]">
      <div className="flex min-h-[420px] flex-col rounded-[26px] bg-stone-100 px-4 pb-[18px] pt-4">
        <div className="mb-3.5 flex justify-between font-mono text-[11px] font-medium text-stone-500">
          <span>14.32</span>
          <span>{STORE_NAME}</span>
        </div>

        <div className="text-[15px] font-bold text-stone-900">{s.title}</div>
        <div
          className={`mt-3 break-words font-extrabold leading-[1.1] tracking-[-0.04em] text-stone-900 ${bigSize(
            s.big
          )}`}
        >
          {s.big}
        </div>
        <div className="mb-3.5 mt-0.5 text-[12.5px] text-stone-500">
          {s.cap}
        </div>

        <div>
          {s.rows.map((r) => (
            <div
              key={r.l}
              className="flex justify-between gap-2 border-t border-stone-200 py-[9px] text-[13px]"
            >
              <span className="text-stone-600">{r.l}</span>
              <span
                className={`font-mono tabular-nums ${
                  r.warn ? "text-orange-700" : "text-stone-900"
                }`}
              >
                {r.r}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-5">
          <div
            aria-hidden
            className="rounded-xl bg-brand-600 py-[11px] text-center text-[13.5px] font-semibold text-white"
          >
            {s.btn}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Komponen utama                                                     */
/* ------------------------------------------------------------------ */
export function BentoFeatures() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [manual, setManual] = useState(false);

  // Ganti fitur otomatis sampai pengunjung berinteraksi
  useEffect(() => {
    if (manual || reduce) return;
    const id = setInterval(
      () => setActive((a) => (a + 1) % FEATURES.length),
      INTERVAL
    );
    return () => clearInterval(id);
  }, [manual, reduce]);

  const pick = (i: number) => {
    setManual(true);
    setActive(i);
  };

  const f = FEATURES[active];
  const auto = !manual && !reduce;

  return (
    <section id="fitur" className="px-4 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_400px] lg:gap-20">
        {/* ---------- Kiri: judul + daftar fitur (TIDAK DIUBAH) ---------- */}
        <div>
          <h2 className="font-display max-w-[16ch] text-3xl font-bold leading-[1.12] tracking-tight text-stone-900 md:text-4xl">
            Satu aplikasi untuk seluruh toko kamu
          </h2>
          <p className="mt-3 max-w-[38ch] text-stone-500">
            Dari kasir sampai laporan, semuanya terintegrasi.
          </p>

          <ul className="mt-9 border-t border-stone-300">
            {FEATURES.map((it, i) => {
              const on = i === active;
              return (
                <li key={it.name} className="border-b border-stone-300">
                  <button
                    type="button"
                    onClick={() => pick(i)}
                    onMouseEnter={() => pick(i)}
                    aria-current={on}
                    className={`relative grid w-full grid-cols-[20px_1fr] items-baseline gap-x-1 py-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${
                      on
                        ? "text-stone-900"
                        : "text-stone-500 hover:text-stone-900"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`size-1.5 translate-y-[-2px] rounded-full transition-colors ${
                        on ? "bg-brand-600" : "bg-stone-300"
                      }`}
                    />
                    <span className="text-base font-semibold">{it.name}</span>

                    <span
                      className={`col-start-2 grid text-sm text-stone-500 transition-[grid-template-rows,opacity] duration-300 ${
                        on
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <span className="overflow-hidden">{it.desc}</span>
                    </span>

                    {/* garis progres penanda pergantian otomatis */}
                    {on && auto && (
                      <motion.span
                        key={active}
                        aria-hidden
                        className="absolute -bottom-px left-0 h-px bg-brand-600"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{
                          duration: INTERVAL / 1000,
                          ease: "linear",
                        }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="mt-4 text-sm text-stone-500">
            Cetak struk thermal: segera hadir.
          </p>
        </div>

        {/* ---------- Kanan: layar HP ---------- */}
        <div className="mx-auto w-full max-w-md">
          <motion.div
            key={active}
            initial={reduce ? false : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            aria-live="polite"
          >
            <PhoneScreen s={f.screen} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}