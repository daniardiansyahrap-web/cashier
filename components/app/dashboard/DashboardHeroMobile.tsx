"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Search, ScanBarcode } from "lucide-react";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 11) return "Selamat pagi";
  if (h < 15) return "Selamat siang";
  if (h < 19) return "Selamat sore";
  return "Selamat malam";
}

export function DashboardHeroMobile({
  userName,
  outletName,
  lowStockCount,
}: {
  userName: string;
  outletName: string;
  lowStockCount: number;
}) {
  const [greeting, setGreeting] = useState("Selamat datang");

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  const firstName = userName.split(" ")[0];

  return (
    <section className="bg-cx-hero text-white px-[18px] pt-4 pb-16 rounded-b-[28px] lg:hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] text-[#9aa7d6] mb-0.5">{greeting},</p>
          <p className="text-[20px] font-extrabold tracking-[-0.02em]">
            {firstName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="bg-white/10 rounded-full px-3 py-1.5 text-[12.5px] font-semibold flex items-center gap-1"
          >
            <span className="truncate max-w-[120px]">{outletName}</span>
            <span className="text-white/60">▾</span>
          </button>
          <a
            href="#perlu-dilihat"
            className="relative size-9 rounded-xl bg-white/10 grid place-items-center active:scale-[0.95] transition-transform"
            aria-label="Lihat peringatan"
          >
            <Bell className="size-5" strokeWidth={1.9} aria-hidden />
            {lowStockCount > 0 && (
              <span className="absolute top-1 right-1 size-2.5 rounded-full bg-cx-orange border-2 border-cx-navy" />
            )}
          </a>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Link
          href="/kasir?focus=search"
          className="flex-1 flex items-center gap-2 bg-white rounded-[14px] px-4 py-3 text-[14px] text-cx-muted"
        >
          <Search className="size-4" strokeWidth={1.9} aria-hidden />
          <span>Cari produk atau scan barcode</span>
        </Link>
        <Link
          href="/kasir?scan=1"
          className="size-[46px] rounded-[14px] bg-cx-cta grid place-items-center active:scale-[0.95] transition-transform"
          aria-label="Scan barcode"
        >
          <ScanBarcode className="size-5 text-white" strokeWidth={2} aria-hidden />
        </Link>
      </div>
    </section>
  );
}