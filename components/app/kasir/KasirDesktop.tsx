"use client";

import { useState } from "react";
import { Search, Minus, Plus, ShoppingCart } from "lucide-react";
import { rupiah } from "@/lib/format";

type Produk = { id: string; nama: string; sku: string | null; barcode: string | null; hargaJual: number; satuan: string };
type CartItem = { productId: string; namaProduk: string; harga: number; qty: number };

export function KasirDesktop({
  produk, cart, addToCart, updateQty, removeFromCart, clearCart, total, onBayar
}: {
  produk: Produk[]; cart: CartItem[]; addToCart: (p: Produk) => void; updateQty: (id: string, qty: number) => void; removeFromCart: (id: string) => void; clearCart: () => void; total: number; onBayar: () => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = produk.filter((p) => p.nama.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="hidden lg:flex h-[calc(100vh-40px)] overflow-hidden">
      {/* KIRI: Grid Produk */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f6f7fb] border-r border-[#dde1ec]">
        <div className="p-6 pb-2 shrink-0">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-[18px] text-slate-400" />
            <input
              type="text"
              placeholder="Cari produk (nama / SKU)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-white border border-[#dde1ec] rounded-xl text-sm focus:outline-none focus:border-[#c2410c] transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-[#757895]">Produk tidak ditemukan</div>
          ) : (
            <div className="grid grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((p) => {
                const qtyInCart = cart.find((c) => c.productId === p.id)?.qty || 0;
                return (
                  <button
                    key={p.id}
                    onClick={() => addToCart(p)}
                    className={`relative flex flex-col text-left p-4 bg-white border rounded-xl transition-all hover:shadow-md ${
                      qtyInCart > 0 ? "border-[#c2410c]" : "border-[#dde1ec] hover:border-[#c2410c]/50"
                    }`}
                  >
                    {qtyInCart > 0 && (
                      <span className="absolute -top-2 -right-2 size-6 bg-[#c2410c] text-white text-xs font-bold rounded-full grid place-items-center">
                        {qtyInCart}
                      </span>
                    )}
                    <div className="font-bold text-[13px] text-[#0b1230] line-clamp-2 mb-1">{p.nama}</div>
                    <div className="text-[11px] text-[#757895] mb-3">{p.sku || "-"}</div>
                    <div className="text-[14px] font-bold text-[#c2410c] mt-auto">{rupiah(p.hargaJual)}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* KANAN: Keranjang */}
      <div className="w-[380px] shrink-0 bg-white flex flex-col">
        <div className="p-6 border-b border-[#dde1ec] flex justify-between items-center">
          <h2 className="font-extrabold text-lg text-[#0b1230] flex items-center gap-2">
            <ShoppingCart className="size-5" />
            Keranjang
          </h2>
          {cart.length > 0 && (
            <button onClick={clearCart} className="text-xs font-bold text-[#c2410c] hover:underline">Kosongkan</button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-20 text-[#757895] text-sm">Keranjang masih kosong.<br />Pilih produk di sebelah kiri.</div>
          ) : (
            cart.map((item) => (
              <div key={item.productId} className="flex flex-col gap-2 bg-[#f6f7fb] p-3 rounded-xl border border-[#dde1ec]">
                <div className="flex justify-between items-start">
                  <div className="font-bold text-sm text-[#0b1230]">{item.namaProduk}</div>
                  <button onClick={() => removeFromCart(item.productId)} className="text-xs font-bold text-[#c2410c]">Hapus</button>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <div className="flex items-center gap-3 bg-white border border-[#dde1ec] rounded-lg p-1">
                    <button onClick={() => updateQty(item.productId, item.qty - 1)} className="size-6 grid place-items-center hover:bg-slate-100 rounded"><Minus className="size-3" /></button>
                    <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.productId, item.qty + 1)} className="size-6 grid place-items-center hover:bg-slate-100 rounded"><Plus className="size-3" /></button>
                  </div>
                  <div className="font-bold text-sm text-[#0b1230]">{rupiah(item.harga * item.qty)}</div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-[#dde1ec] bg-white">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-slate-500 font-medium">Total Tagihan</span>
            <span className="text-2xl font-extrabold text-[#0b1230]">{rupiah(total)}</span>
          </div>
          <button onClick={onBayar} disabled={cart.length === 0} className="w-full h-12 bg-[#c2410c] text-white font-bold rounded-xl active:scale-[0.98] transition-transform disabled:opacity-50 disabled:active:scale-100">
            Bayar Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}