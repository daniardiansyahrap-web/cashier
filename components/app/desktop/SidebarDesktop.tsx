"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingCart,
    Clock,
    Package,
    Layers,
    BarChart3,
    PanelLeftClose,
    PanelLeftOpen,
    LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

const MENU_ITEMS = [
    { href: "/dashboard", label: "Beranda", icon: LayoutDashboard },
    { href: "/kasir", label: "Kasir", icon: ShoppingCart, kbd: "F2" },
    { href: "/transaksi", label: "Riwayat", icon: Clock },
    { href: "/produk", label: "Produk", icon: Package },
    { href: "/stok", label: "Stok", icon: Layers, badge: 5 }, // TODO: ambil dari DB
    { href: "/laporan", label: "Laporan", icon: BarChart3 },
];

export function SidebarDesktop({
    userName,
    userRole,
    trialDaysLeft,
}: {
    userName: string;
    userRole: string;
    trialDaysLeft: number;
}) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("cx.sidebar");
        if (saved === "collapsed") setCollapsed(true);
    }, []);

    const toggle = () => {
        const next = !collapsed;
        setCollapsed(next);
        localStorage.setItem("cx.sidebar", next ? "collapsed" : "expanded");
    };

    const initial = userName.charAt(0).toUpperCase();
    const firstName = userName.split(" ")[0];

    return (
        <aside
            className={`hidden lg:flex sticky top-0 h-screen flex-col bg-[#0b1437] text-white transition-[width] duration-200 z-30 shrink-0 ${collapsed ? "w-[68px]" : "w-[216px]"
                }`}
            style={{ padding: "18px 12px 14px" }}
        >
            {/* Logo */}
            <div className={`flex items-center gap-2 px-1.5 mb-3 ${collapsed ? "justify-center" : ""}`}>
                <img
                    src="/logo-full.png"
                    alt="Cashier"
                    className={`object-contain shrink-0 transition-all ${collapsed ? "h-7 w-7 object-left" : "h-8"
                        }`}
                />
            </div>

            {/* Menu */}
            <nav aria-label="Menu utama" className="flex-1 overflow-y-auto overflow-x-hidden space-y-0.5 mt-2">
                {MENU_ITEMS.map((item, i) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    // Penanda kelompok (jualan, barang, rekap)
                    let groupLabel = null;
                    if (i === 1) groupLabel = "jualan";
                    if (i === 3) groupLabel = "barang";
                    if (i === 5) groupLabel = "rekap";

                    return (
                        <div key={item.href}>
                            {groupLabel && !collapsed && (
                                <div className="mx-1.5 mt-3.5 mb-1.5 flex items-center gap-2">
                                    <span className="text-[10.5px] font-semibold text-[#7683b3]">{groupLabel}</span>
                                    <div className="flex-1 border-t border-dashed border-white/15" />
                                </div>
                            )}
                            {groupLabel && collapsed && (
                                <div className="mx-2 mt-3 mb-1.5 border-t border-dashed border-white/15" />
                            )}

                            <Link
                                href={item.href}
                                title={item.label}
                                aria-current={isActive ? "page" : undefined}
                                className={`relative flex h-9 items-center gap-2.5 overflow-hidden whitespace-nowrap rounded-lg mb-0.5 text-[13px] font-semibold transition-colors ${collapsed ? "justify-center px-0" : "px-3"
                                    } ${isActive
                                        ? "bg-white/[0.08] text-white before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-[#f97316]"
                                        : "text-[#c7cce4] hover:bg-white/[0.06] hover:text-white"
                                    }`}
                            >
                                <Icon className="size-[17px] shrink-0" strokeWidth={1.9} aria-hidden />
                                {!collapsed && <span>{item.label}</span>}
                                {!collapsed && item.kbd && (
                                    <kbd className="ml-auto rounded border border-white/[0.18] px-[5px] text-[10px] font-semibold text-[#7f8cbd]">
                                        {item.kbd}
                                    </kbd>
                                )}
                                {item.badge ? (
                                    <span
                                        className={
                                            collapsed
                                                ? "absolute right-[9px] top-[5px] size-2 rounded-full bg-[#f97316]"
                                                : "ml-auto grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#f97316] px-[5px] text-[10px] font-extrabold text-white"
                                        }
                                    >
                                        {collapsed ? null : item.badge}
                                    </span>
                                ) : null}
                            </Link>
                        </div>
                    );
                })}
            </nav>

            <div className="flex-1 min-h-6" />

            {/* Tombol Kecilkan */}
            <button
                onClick={toggle}
                className={`flex h-9 items-center gap-2.5 rounded-lg mb-0.5 text-[13px] font-semibold text-[#c7cce4] hover:bg-white/[0.06] hover:text-white transition-colors ${collapsed ? "justify-center px-0" : "px-3"
                    }`}
                title={collapsed ? "Lebarkan menu" : "Kecilkan menu"}
            >
                {collapsed ? <PanelLeftOpen className="size-[17px]" /> : <PanelLeftClose className="size-[17px]" />}
                {!collapsed && <span>Kecilkan menu</span>}
            </button>

            {/* Trial Block */}
            {trialDaysLeft > 0 && (
                <div className={`pt-3 border-t border-dashed border-white/15 ${collapsed ? "px-0" : "px-1.5"}`}>
                    {!collapsed && (
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[12px] font-bold text-white">Masa coba</span>
                            <span className="text-[11.5px] font-bold text-[#fdba74]">Sisa {trialDaysLeft} hari</span>
                        </div>
                    )}
                    <div className={`flex gap-[3px] mb-2 ${collapsed ? "flex-col items-center" : ""}`}>
                        {Array.from({ length: 14 }).map((_, i) => {
                            const used = 14 - trialDaysLeft;
                            const isUsed = i < used;
                            return (
                                <div
                                    key={i}
                                    className={`h-4 rounded-sm ${collapsed ? "w-full" : "flex-1"} ${isUsed ? "bg-white/[0.22]" : "bg-[#f97316]"
                                        }`}
                                />
                            );
                        })}
                    </div>
                    {!collapsed && (
                        <Link href="#" className="text-[11px] font-semibold text-[#c7cce4] hover:text-white">
                            Pilih paket ›
                        </Link>
                    )}
                </div>
            )}

            {/* Profil */}
            <div className={`mt-3 border-t border-white/10 pt-3 flex items-center gap-[9px] ${collapsed ? "justify-center px-0" : "px-1"}`}>
                <div className="size-[30px] rounded-full bg-[#243063] grid place-items-center text-[12px] font-bold text-white shrink-0">
                    {initial}
                </div>
                {!collapsed && (
                    <div className="min-w-0 flex-1">
                        <div className="text-[12.5px] font-bold text-white truncate">{firstName}</div>
                        <div className="text-[10.5px] font-medium text-[#869fc2] truncate">{userRole}</div>
                    </div>
                )}
                {!collapsed && (
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="text-[#8e9bcb] hover:text-white p-1"
                        aria-label="Keluar"
                        title="Keluar"
                    >
                        <LogOut className="size-4" strokeWidth={1.9} />
                    </button>
                )}
            </div>
        </aside>
    );
}