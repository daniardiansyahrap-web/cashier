"use client";

import Link from "next/link";
import { ShoppingCart, ScanBarcode, Plus } from "lucide-react";

export function AksiCepat() {
  return (
    <div className="bg-white rounded-[22px] lg:rounded-lg p-6 shadow-cx-card h-full flex flex-col">
      <h3 className="text-[15px] font-extrabold text-cx-navy mb-4">
        Aksi cepat
      </h3>

      {/* Tombol utama */}
      <Link
        href="/kasir"
        className="bg-cx-cta text-white rounded-xl py-3.5 px-4 flex items-center justify-center gap-2 text-[14px] font-bold active:scale-[0.98] transition-transform"
      >
        <ShoppingCart className="size-5" strokeWidth={2} aria-hidden />
        Buka Kasir
        <kbd className="ml-1 bg-white/20 rounded px-1.5 py-0.5 text-[10px] font-mono">
          F2
        </kbd>
      </Link>

      {/* Tombol sekunder */}
      <div className="grid grid-cols-2 gap-2 mt-3">
        <Link
          href="/kasir?scan=1"
          className="border border-cx-line text-cx-navy rounded-xl py-3 px-3 flex items-center justify-center gap-1.5 text-[13px] font-semibold active:scale-[0.98] transition-transform"
        >
          <ScanBarcode className="size-4" strokeWidth={1.9} aria-hidden />
          Scan
        </Link>
        <Link
          href="/stok"
          className="border border-cx-line text-cx-navy rounded-xl py-3 px-3 flex items-center justify-center gap-1.5 text-[13px] font-semibold active:scale-[0.98] transition-transform"
        >
          <Plus className="size-4" strokeWidth={2} aria-hidden />
          Stok
        </Link>
      </div>

      {/* Hint — dipush ke bawah */}
      <p className="text-[11px] text-cx-muted mt-auto pt-4 leading-relaxed">
        Tekan{" "}
        <kbd className="bg-cx-bg px-1.5 py-0.5 rounded font-mono text-[10px]">
          /
        </kbd>{" "}
        untuk mencari produk,{" "}
        <kbd className="bg-cx-bg px-1.5 py-0.5 rounded font-mono text-[10px]">
          F2
        </kbd>{" "}
        untuk membuka kasir.
      </p>
    </div>
  );
}