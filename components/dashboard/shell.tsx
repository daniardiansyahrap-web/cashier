"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { LogoutButton } from "./logout-button";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/kasir", label: "Kasir", icon: "🛒" },
  { href: "/produk", label: "Produk", icon: "📦" },
  { href: "/stok", label: "Stok", icon: "📥" },
  { href: "/transaksi", label: "Transaksi", icon: "🧾" },
  { href: "/laporan", label: "Laporan", icon: "📈" },
];

export function DashboardShell({
  children,
  userName,
  userRole,
}: {
  children: React.ReactNode;
  userName: string;
  userRole: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar (mobile) */}
      <header className="lg:hidden bg-white border-b sticky top-0 z-30 flex items-center justify-between px-4 py-3">
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-md hover:bg-gray-100"
          aria-label="Buka menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="font-bold">Cashier</div>
        <div className="w-10" />
      </header>

      <div className="flex">
        {/* Overlay saat sidebar terbuka (mobile) */}
        {open && (
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r flex flex-col transition-transform duration-200 ${
            open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Header sidebar */}
          <div className="p-6 border-b flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold">Cashier</h1>
              <p className="text-xs text-gray-500 mt-1">{userName}</p>
              <p className="text-xs text-gray-400">{userRole}</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="lg:hidden p-1 rounded hover:bg-gray-100"
              aria-label="Tutup menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menu */}
          <nav className="flex-1 p-4 space-y-1 overflow-auto">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-3 lg:py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <LogoutButton />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 overflow-auto">{children}</main>
      </div>
    </div>
  );
}