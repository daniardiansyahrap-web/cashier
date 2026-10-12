"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, ShoppingCart } from "lucide-react";

const produkDummy = [
  { id: 1, nama: "Indomie Goreng", harga: 3500, emoji: "🍜" },
  { id: 2, nama: "Teh Botol Sosro", harga: 5000, emoji: "🧋" },
  { id: 3, nama: "Kopi Kapal Api", harga: 2500, emoji: "☕" },
  { id: 4, nama: "Roti Tawar", harga: 15000, emoji: "🍞" },
  { id: 5, nama: "Susu Ultra 250ml", harga: 6500, emoji: "🥛" },
  { id: 6, nama: "Chitato Sapi", harga: 12000, emoji: "🥔" },
];

type CartItem = {
  id: number;
  nama: string;
  harga: number;
  emoji: string;
  qty: number;
};

export function PosMockup() {
  const [cart, setCart] = useState<CartItem[]>([
    { id: 1, nama: "Indomie Goreng", harga: 3500, emoji: "🍜", qty: 2 },
    { id: 2, nama: "Teh Botol Sosro", harga: 5000, emoji: "🧋", qty: 1 },
  ]);

  const total = cart.reduce((sum, item) => sum + item.harga * item.qty, 0);

  function addToCart(p: typeof produkDummy[0]) {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === p.id);
      if (existing) {
        return prev.map((i) =>
          i.id === p.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...p, qty: 1 }];
    });
  }

  function updateQty(id: number, delta: number) {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  }

  function formatRupiah(angka: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  }

  return (
    <div className="w-full h-full bg-slate-50 flex text-slate-900 overflow-hidden">
      {/* Kiri: Grid Produk */}
      <div className="flex-1 p-4 flex flex-col min-w-0">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 bg-white rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-400">
            🔍 Cari produk atau scan barcode...
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 overflow-auto flex-1">
          {produkDummy.map((p) => (
            <motion.button
              key={p.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => addToCart(p)}
              className="bg-white rounded-lg border border-slate-200 p-2 text-left hover:border-brand-400 hover:shadow-md transition-all"
            >
              <div className="text-2xl mb-1">{p.emoji}</div>
              <div className="text-[10px] font-semibold leading-tight line-clamp-2">
                {p.nama}
              </div>
              <div className="text-[10px] text-brand-600 font-bold mt-1">
                {formatRupiah(p.harga)}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Kanan: Keranjang */}
      <div className="w-[180px] bg-white border-l border-slate-200 flex flex-col">
        <div className="p-3 border-b border-slate-100 flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-brand-600" />
          <span className="text-xs font-bold">Keranjang</span>
        </div>

        <div className="flex-1 overflow-auto p-2 space-y-1.5">
          {cart.length === 0 ? (
            <div className="text-center py-8 text-[10px] text-slate-400">
              Keranjang kosong
            </div>
          ) : (
            cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-slate-50 rounded-lg p-2"
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="text-[10px] font-semibold leading-tight flex-1">
                    {item.nama}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="w-5 h-5 rounded bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100"
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                    <span className="text-[10px] font-bold w-4 text-center">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="w-5 h-5 rounded bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100"
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  <div className="text-[10px] font-bold text-brand-600">
                    {formatRupiah(item.harga * item.qty)}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <div className="p-3 border-t border-slate-100 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-500">Total</span>
            <motion.span
              key={total}
              initial={{ scale: 1.2, color: "#f97316" }}
              animate={{ scale: 1, color: "#1d4ed8" }}
              className="text-sm font-bold"
            >
              {formatRupiah(total)}
            </motion.span>
          </div>
          <button className="w-full bg-accent-500 hover:bg-accent-600 text-white text-[10px] font-bold py-2 rounded-lg transition-colors">
            Bayar Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}