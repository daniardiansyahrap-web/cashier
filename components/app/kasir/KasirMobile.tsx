"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ScanBarcode, ShoppingCart, X, Minus, Plus } from "lucide-react";
import { rupiah } from "@/lib/format";

type Produk = { id: string; nama: string; sku: string | null; barcode: string | null; hargaJual: number; satuan: string };
type CartItem = { productId: string; namaProduk: string; harga: number; qty: number };

export function KasirMobile({
  produk, cart, addToCart, updateQty, removeFromCart, clearCart, total, onBayar
}: {
  produk: Produk[]; cart: CartItem[]; addToCart: (p: Produk) => void; updateQty: (id: string, qty: number) => void; removeFromCart: (id: string) => void; clearCart: () => void; total: number; onBayar: () => void;
}) {
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  const filtered = produk.filter((p) => p.nama.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="lg:hidden flex flex-col h-[calc(100vh-64px)] bg-[#f6f7fb]">
      {/* Header Pencarian */}
      <div className="p-4 space-y-3 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari produk atau scan barcode"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-9 pr-4 bg-white border border-[#dde1ec] rounded-xl text-sm focus:outline-none focus:border-[#c2410c]"
          />
        </div>
      </div>

      {/* Grid Produk */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm">Produk tidak ditemukan</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((p) => {
              const qtyInCart = cart.find((c) => c.productId === p.id)?.qty || 0;
              return (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className={`relative flex flex-col text-left p-3 bg-white border rounded-xl transition-all ${
                    qtyInCart > 0 ? "border-[#c2410c] shadow-[0_2px_10px_rgba(194,65,12,0.1)]" : "border-[#dde1ec]"
                  }`}
                >
                  {qtyInCart > 0 && (
                    <span className="absolute -top-2 -right-2 size-5 bg-[#c2410c] text-white text-[10px] font-bold rounded-full grid place-items-center">
                      {qtyInCart}
                    </span>
                  )}
                  <div className="font-bold text-[13px] text-[#0b1230] line-clamp-2 mb-1">{p.nama}</div>
                  <div className="text-[10px] text-[#757895] mb-2">{p.sku || "-"}</div>
                  <div className="text-[13px] font-bold text-[#c2410c] mt-auto">{rupiah(p.hargaJual)}</div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Button Keranjang */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-20 right-4 size-14 bg-[#c2410c] text-white rounded-full shadow-xl shadow-orange-500/40 grid place-items-center z-40 active:scale-95 transition-transform"
      >
        <ShoppingCart className="size-6" />
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 size-5 bg-white text-[#c2410c] text-[10px] font-extrabold rounded-full grid place-items-center border-2 border-[#c2410c]">
            {cart.reduce((s, i) => s + i.qty, 0)}
          </span>
        )}
      </button>

      {/* Drawer Keranjang Mobile */}
      {cartOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setCartOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 h-[80vh] bg-white rounded-t-3xl z-50 flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-extrabold text-lg text-[#0b1230]">Keranjang</h2>
              <button onClick={() => setCartOpen(false)} className="p-2 bg-slate-100 rounded-full"><X className="size-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.map((item) => (
                <div key={item.productId} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <div className="font-bold text-sm text-[#0b1230]">{item.namaProduk}</div>
                    <div className="text-xs text-[#757895]">{rupiah(item.harga)}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => updateQty(item.productId, item.qty - 1)} className="size-7 bg-white border rounded-md grid place-items-center"><Minus className="size-3" /></button>
                    <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.productId, item.qty + 1)} className="size-7 bg-white border rounded-md grid place-items-center"><Plus className="size-3" /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t bg-white">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-slate-500">Total</span>
                <span className="text-xl font-extrabold text-[#0b1230]">{rupiah(total)}</span>
              </div>
              <button onClick={onBayar} className="w-full h-12 bg-[#c2410c] text-white font-bold rounded-xl active:scale-[0.98] transition-transform">Bayar Sekarang</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}