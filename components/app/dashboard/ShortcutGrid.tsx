"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  ScanBarcode,
  Package,
  Layers,
  Clock,
  BarChart3,
  Store,
  LayoutGrid,
  Settings,
  LogOut,
} from "lucide-react";

const TONE = {
  orange: "bg-[#fff0e3] text-cx-orange-d",
  blue: "bg-[#e8eefc] text-cx-blue",
  navy: "bg-[#e7eaf5] text-cx-navy",
} as const;

const ITEMS = [
  { href: "/kasir", label: "Kasir", icon: ShoppingCart, tone: "orange" },
  { href: "/kasir?scan=1", label: "Scan", icon: ScanBarcode, tone: "orange" },
  { href: "/produk", label: "Produk", icon: Package, tone: "blue" },
  { href: "/stok", label: "Stok", icon: Layers, tone: "blue" },
  { href: "/transaksi", label: "Riwayat", icon: Clock, tone: "navy" },
  { href: "/laporan", label: "Laporan", icon: BarChart3, tone: "navy" },
  { href: "/dashboard", label: "Outlet", icon: Store, tone: "blue" },
] as const;

export function ShortcutGrid() {
  const [moreOpen, setMoreOpen] = useState(false);

  const tile =
    "flex flex-col items-center gap-[7px] text-center text-xs font-semibold text-cx-navy active:scale-[0.98] transition-transform lg:rounded-2xl lg:bg-white lg:p-4 lg:border lg:border-cx-line lg:hover:-translate-y-0.5 lg:transition-transform";

  return (
    <>
      <nav
        aria-label="Menu pintas"
        className="grid grid-cols-4 gap-x-1 gap-y-4 px-3.5 pt-5 md:grid-cols-8 lg:gap-4 lg:px-0"
      >
        {ITEMS.map(({ href, label, icon: Icon, tone }) => (
          <Link key={label} href={href} className={tile}>
            <span
              className={`grid size-[54px] place-items-center rounded-[18px] ${TONE[tone]}`}
            >
              <Icon className="size-[22px]" strokeWidth={1.9} aria-hidden />
            </span>
            {label}
          </Link>
        ))}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className={tile}
        >
          <span
            className={`grid size-[54px] place-items-center rounded-[18px] ${TONE.navy}`}
          >
            <LayoutGrid className="size-[22px]" strokeWidth={1.9} aria-hidden />
          </span>
          Lainnya
        </button>
      </nav>

      {/* Bottom sheet "Lainnya" */}
      {moreOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setMoreOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-w-lg mx-auto pb-[max(16px,env(safe-area-inset-bottom))]">
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mt-3 mb-4" />
            <h3 className="text-[16px] font-extrabold text-cx-navy px-6 mb-4">
              Menu Lainnya
            </h3>
            <div className="px-3 space-y-1">
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium text-cx-navy hover:bg-cx-bg text-left"
              >
                <Settings className="size-5 text-cx-muted" strokeWidth={1.9} aria-hidden />
                Pengaturan
                <span className="ml-auto text-[10px] text-cx-orange-d font-bold bg-[#fff1e6] px-2 py-0.5 rounded-full">
                  Segera
                </span>
              </button>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium text-cx-navy hover:bg-cx-bg text-left"
              >
                <Store className="size-5 text-cx-muted" strokeWidth={1.9} aria-hidden />
                Kelola Outlet
                <span className="ml-auto text-[10px] text-cx-orange-d font-bold bg-[#fff1e6] px-2 py-0.5 rounded-full">
                  Segera
                </span>
              </button>
            </div>
            <div className="border-t border-cx-line mt-3 pt-3 px-3">
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium text-red-600 hover:bg-red-50 text-left"
              >
                <LogOut className="size-5" strokeWidth={1.9} aria-hidden />
                Keluar
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}