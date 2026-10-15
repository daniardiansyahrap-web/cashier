"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ScanBarcode, Bell, ChevronDown } from "lucide-react";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 11) return "Selamat pagi";
  if (h < 15) return "Selamat siang";
  if (h < 19) return "Selamat sore";
  return "Selamat malam";
}

export function DashboardHeroDesktop({
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
    <section className="hidden lg:block bg-gradient-to-b from-[#0b1438] to-[#111b4a] text-white h-[118px] rounded-br-[44px] relative">
      <div className="mx-auto w-full max-w-[1240px] px-7 pt-[19px]">
        <div className="flex items-center justify-between">
          {/* KIRI: sapaan + pencarian + scan */}
          <div className="flex items-center gap-6">
            {/* Sapaan */}
            <div className="shrink-0">
              <p className="text-[11px] text-[#a7b0d4] leading-tight">
                {greeting},
              </p>
              <p className="text-[17px] font-bold text-white leading-tight mt-0.5">
                {firstName}
              </p>
            </div>

            {/* Pencarian + Scan */}
            <div className="flex items-center gap-2">
              <Link
                href="/kasir?focus=search"
                className="h-[33px] w-[320px] rounded-[9px] bg-white flex items-center px-3 gap-2 hover:bg-white/95 transition-colors"
              >
                <Search
                  className="size-[14px] text-[#8a93b8] shrink-0"
                  strokeWidth={1.9}
                  aria-hidden
                />
                <span className="text-[11.5px] text-[#8a93b8] flex-1 truncate">
                  Cari produk atau scan barcode
                </span>
                <kbd className="rounded border border-[#d9dcea] bg-white px-1.5 text-[10px] font-bold text-[#8a93b8] shrink-0">
                  /
                </kbd>
              </Link>
              <Link
                href="/kasir?scan=1"
                className="size-[33px] rounded-[9px] bg-[#c2410c] grid place-items-center hover:bg-[#a83a0a] transition-colors"
                aria-label="Scan barcode"
              >
                <ScanBarcode
                  className="size-[15px] text-white"
                  strokeWidth={2}
                  aria-hidden
                />
              </Link>
            </div>
          </div>

          {/* KANAN: outlet + lonceng */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="h-7 rounded-full bg-[#243063] px-3 flex items-center gap-1.5 text-[11px] font-bold text-white hover:bg-[#2e3b78] transition-colors"
            >
              <span className="truncate max-w-[140px]">{outletName}</span>
              <ChevronDown
                className="size-3 text-white/70"
                strokeWidth={2.5}
                aria-hidden
              />
            </button>
            <a
              href="#perlu-dilihat"
              className="relative size-[27px] rounded-full bg-[#243063] grid place-items-center hover:bg-[#2e3b78] transition-colors"
              aria-label="Lihat peringatan"
            >
              <Bell
                className="size-[13px] text-white"
                strokeWidth={1.9}
                aria-hidden
              />
              {lowStockCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 size-[6px] rounded-full bg-[#f97316] border border-[#0b1438]" />
              )}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}