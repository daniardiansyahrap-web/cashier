"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Layers,
  PackageCheck,
  Clock,
  BarChart3,
  Menu,
  X,
} from "lucide-react";
import { LogoutButton } from "@/components/dashboard/logout-button";

const MENU_ITEMS: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  alwaysOrange?: boolean;
}[] = [
    { href: "/dashboard", label: "Beranda", icon: LayoutDashboard },
    { href: "/kasir", label: "Kasir", icon: ShoppingCart, alwaysOrange: true },
    { href: "/produk", label: "Produk", icon: Package },
    { href: "/stok", label: "Stok", icon: Layers },
    { href: "/transaksi", label: "Riwayat", icon: Clock },
    { href: "/laporan", label: "Laporan", icon: BarChart3 },
  ];

const BOTTOM_NAV_ITEMS = [
  { href: "/dashboard", label: "Beranda", icon: LayoutDashboard },
  { href: "/produk", label: "Produk", icon: Package },
  { href: "/kasir", label: "Kasir", icon: ShoppingCart, isFAB: true },
  { href: "/stok", label: "Stok", icon: PackageCheck },
  { href: "/laporan", label: "Laporan", icon: BarChart3 },
];

export function AppShell({
  children,
  userName,
  userRole,
  outletName,
  header,
}: {
  children: React.ReactNode;
  userName: string;
  userRole: string;
  outletName: string;
  header?: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const hasHeader = !!header;

  return (
    <div className="min-h-screen bg-cx-bg">
      {/* ========== TOP BAR (mobile) ========== */}
      {!hasHeader && (
        <header className="lg:hidden bg-cx-hero text-white px-[18px] pt-4 pb-3">
          <div className="flex items-center justify-between">
            <img
              src="/logo-full.png"
              alt="Cashier"
              className="h-7 object-contain"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="bg-white/10 rounded-full px-3 py-1.5 text-[12.5px] font-semibold flex items-center gap-1"
              >
                <span className="truncate max-w-[80px]">{outletName}</span>
                <span className="text-white/60">▾</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="size-9 rounded-xl bg-white/10 grid place-items-center"
                aria-label="Buka menu"
              >
                <Menu className="size-5" strokeWidth={1.9} aria-hidden />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* ========== DESKTOP SIDEBAR ========== */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-64 bg-cx-navy text-white flex-col z-40">
        {/* Logo */}
        <div className="px-6 py-6">
          <img
            src="/logo-full.png"
            alt="Cashier"
            className="h-9 object-contain"
          />
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 space-y-1">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex items-center gap-3 px-3 py-3 rounded-md text-[14px] font-semibold transition-colors ${isActive
                  ? "bg-[#1c2747] text-white"
                  : "text-white/60 hover:bg-white/[0.06] hover:text-white"
                  }`}
              >
                <Icon className="size-[18px]" strokeWidth={1.9} aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-9 rounded-full bg-white/10 grid place-items-center text-[13px] font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-bold truncate">{userName}</div>
              <div className="text-[11px] text-white/50 truncate">
                {userRole}
              </div>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* ========== MOBILE DRAWER ========== */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 left-0 bottom-0 w-72 bg-cx-navy text-white z-50 lg:hidden flex flex-col">
            <div className="px-6 py-6 flex items-center justify-between">
              <img
                src="/logo-full.png"
                alt="Cashier"
                className="h-9 object-contain"
              />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="size-9 rounded-lg bg-white/10 grid place-items-center"
                aria-label="Tutup menu"
              >
                <X className="size-5" strokeWidth={1.9} aria-hidden />
              </button>
            </div>

            <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
              {MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                const isAlwaysOrange = item.alwaysOrange;

                // Kasir: selalu oranye
                if (isAlwaysOrange) {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] font-semibold bg-[#c2410c] text-white hover:bg-[#a83a0a] transition-colors"
                    >
                      <Icon className="size-[18px]" strokeWidth={1.9} aria-hidden />
                      {item.label}
                    </Link>
                  );
                }

                // Menu lain
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded text-[14px] font-semibold transition-colors ${isActive
                        ? "bg-[#3d4a6b] text-white"
                        : "text-white/60 hover:bg-white/[0.06] hover:text-white"
                      }`}
                  >
                    <Icon
                      className={`size-[18px] shrink-0 ${isActive ? "text-[#4ade80]" : ""
                        }`}
                      strokeWidth={1.9}
                      aria-hidden
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-white/10">
              <div className="px-2 mb-3">
                <div className="text-[13px] font-bold truncate">
                  {userName}
                </div>
                <div className="text-[11px] text-white/50">{userRole}</div>
              </div>
              <LogoutButton />
            </div>
          </div>
        </>
      )}

      {/* ========== MAIN AREA ========== */}
      <div className="lg:pl-64">
        {header}

        {hasHeader && (
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden fixed top-5 right-4 z-30 size-9 rounded-xl bg-white/10 backdrop-blur grid place-items-center text-white"
            aria-label="Buka menu"
          >
            <Menu className="size-5" strokeWidth={1.9} aria-hidden />
          </button>
        )}

        <main className={pathname === "/dashboard" ? "pb-28 lg:pb-0" : "pb-28 lg:pb-8"}>
          {children}
        </main>
      </div>

      {/* ========== MOBILE BOTTOM NAV ========== */}
      <nav className="lg:hidden fixed inset-x-0 bottom-0 bg-white border-t border-cx-line z-30">
        <div className="grid grid-cols-5 max-w-lg mx-auto pt-2 pb-[max(8px,env(safe-area-inset-bottom))]">
          {BOTTOM_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            if (item.isFAB) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-1 -mt-6"
                >
                  <div className="size-[52px] rounded-[18px] bg-cx-cta shadow-cx-fab grid place-items-center active:scale-[0.95] transition-transform">
                    <Icon
                      className="size-6 text-white"
                      strokeWidth={2}
                      aria-hidden
                    />
                  </div>
                  <span
                    className={`text-[10.5px] font-semibold ${isActive ? "text-cx-orange-d" : "text-slate-400"
                      }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className="flex flex-col items-center gap-1 py-2"
              >
                <Icon
                  className={`size-5 ${isActive ? "text-cx-blue" : "text-slate-400"
                    }`}
                  strokeWidth={1.9}
                  aria-hidden
                />
                <span
                  className={`text-[10.5px] font-semibold ${isActive ? "text-cx-blue" : "text-slate-400"
                    }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}