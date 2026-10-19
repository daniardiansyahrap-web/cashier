"use client";

import Link from "next/link";
import { ShoppingCart, ScanBarcode, Plus } from "lucide-react";

export function AksiCepatDesktop() {
  return (
    <div className="flex flex-col min-w-0 bg-[#f8f9fc] border border-[#dde1ec] rounded-[10px] p-[22px] h-full">
      <h3 className="text-[12px] font-medium text-[#5c6483] mb-1">
        Aksi cepat
      </h3>

      <Link
        href="/kasir"
        className="mt-[9px] h-[42px] w-full rounded-[9px] bg-gradient-to-b from-[#d9500d] to-[#c2410c] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_8px_16px_-8px_rgba(194,65,12,0.7)] flex items-center justify-center gap-2 text-[13px] font-bold text-white transition-opacity hover:opacity-90"
      >
        <ShoppingCart className="size-[16px]" strokeWidth={2} />
        Buka Kasir
        <span className="rounded bg-white/20 px-1.5 py-0.5 text-[9px] font-bold">
          F2
        </span>
      </Link>

      <div className="mt-2.5 grid grid-cols-2 gap-2.5">
        <Link
          href="/kasir?scan=1"
          className="h-[34px] rounded-[9px] border border-[#e0e3f2] bg-white flex items-center justify-center gap-1.5 text-xs font-bold text-[#0b1230] hover:bg-slate-50 transition-colors"
        >
          <ScanBarcode className="size-[14px]" strokeWidth={2} />
          Scan
        </Link>
        <Link
          href="/stok"
          className="h-[34px] rounded-[9px] border border-[#e0e3f2] bg-white flex items-center justify-center gap-1.5 text-xs font-bold text-[#0b1230] hover:bg-slate-50 transition-colors"
        >
          <Plus className="size-[14px]" strokeWidth={2} />
          Stok
        </Link>
      </div>

      <div className="mt-auto pt-4">
        <p className="text-[10px] text-[#757895]">
          Tekan <span className="font-bold text-[#0b1230]">/</span> untuk
          mencari produk, <span className="font-bold text-[#0b1230]">F2</span>{" "}
          untuk membuka kasir.
        </p>
      </div>
    </div>
  );
}