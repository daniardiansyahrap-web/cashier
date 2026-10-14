"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Layers,
    Clock,
    BarChart3,
    Menu,
    X,
    ScanBarcode,
    MoreHorizontal,
} from "lucide-react";
import { LogoutButton } from "@/components/dashboard/logout-button";

const MENU_ITEMS = [
    { href: "/dashboard", label: "Beranda", icon: LayoutDashboard },
    { href: "/kasir", label: "Kasir", icon: ShoppingCart },
    { href: "/produk", label: "Produk", icon: Package },
    { href: "/stok", label: "Stok", icon: Layers },
    { href: "/transaksi", label: "Riwayat", icon: Clock },
    { href: "/laporan", label: "Laporan", icon: BarChart3 },
];

const BOTTOM_NAV_ITEMS = [
    { href: "/dashboard", label: "Beranda", icon: LayoutDashboard },
    { href: "/produk", label: "Produk", icon: Package },
    { href: "/kasir", label: "Kasir", icon: ShoppingCart, isFAB: true },
    { href: "/stok", label: "Stok", icon: Layers },
    { href: "/laporan", label: "Laporan", icon: BarChart3 },
];

export function AppShell({
    children,
    userName,
    userRole,
    outletName,
}: {
    children: React.ReactNode;
    userName: string;
    userRole: string;
    outletName: string;
}) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-cx-bg">
            {/* ========== TOP BAR (mobile + desktop) ========== */}
            <header className="lg:hidden bg-cx-hero text-white px-[18px] pt-4 pb-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <img
                            src="/logo-full.png"
                            alt="Cashier"
                            className="h-8 md:h-9 object-contain"
                        />
                    </div>

                    {/* Right: outlet pill + hamburger */}
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
                        const isKasir = item.href === "/kasir";

                        if (isKasir) {
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="mx-3 my-3 flex items-center justify-center gap-2 bg-cx-cta hover:opacity-95 text-white rounded-xl py-3 font-bold text-[14px] transition-opacity active:scale-[0.98]"
                                >
                                    <ShoppingCart className="size-5" strokeWidth={1.9} aria-hidden />
                                    Buka Kasir
                                </Link>
                            );
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-current={isActive ? "page" : undefined}
                                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${isActive
                                    ? "bg-white/10 text-white"
                                    : "text-white/70 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                {isActive && (
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-cx-orange rounded-r-full" />
                                )}
                                <Icon className="size-[18px]" strokeWidth={1.9} aria-hidden />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom: user + logout */}
                <div className="p-4 border-t border-white/10 space-y-3">
                    <div className="px-2">
                        <div className="text-[13px] font-bold truncate">{userName}</div>
                        <div className="text-[11px] text-white/50">
                            {userRole} · {outletName}
                        </div>
                    </div>
                    <LogoutButton />
                </div>
            </aside>

            {/* ========== MOBILE DRAWER (hamburger) ========== */}
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
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        aria-current={isActive ? "page" : undefined}
                                        className={`flex items-center gap-3 px-3 py-3 rounded-lg text-[14px] font-medium ${isActive
                                            ? "bg-white/10 text-white"
                                            : "text-white/70 hover:bg-white/5"
                                            }`}
                                    >
                                        <Icon className="size-5" strokeWidth={1.9} aria-hidden />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="p-4 border-t border-white/10">
                            <div className="px-2 mb-3">
                                <div className="text-[13px] font-bold truncate">{userName}</div>
                                <div className="text-[11px] text-white/50">{userRole}</div>
                            </div>
                            <LogoutButton />
                        </div>
                    </div>
                </>
            )}

            {/* ========== MAIN CONTENT ========== */}
            <main className="lg:pl-64 pb-28 lg:pb-8">{children}</main>

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