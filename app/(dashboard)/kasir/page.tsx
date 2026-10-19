"use client";

import { useState, useEffect } from "react";
import { KasirMobile } from "@/components/app/kasir/KasirMobile";
import { KasirDesktop } from "@/components/app/kasir/KasirDesktop";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Produk = { id: string; nama: string; sku: string | null; barcode: string | null; hargaJual: number; satuan: string };
type CartItem = { productId: string; namaProduk: string; harga: number; qty: number };

export default function KasirPage() {
  const [produk, setProduk] = useState<Produk[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [openBayar, setOpenBayar] = useState(false);
  const [metodeBayar, setMetodeBayar] = useState("cash");
  const [nominalBayar, setNominalBayar] = useState("");
  const [saving, setSaving] = useState(false);

  async function fetchProduk() {
    setLoading(true);
    const res = await fetch("/api/produk");
    const data = await res.json();
    setProduk(data);
    setLoading(false);
  }

  useEffect(() => { fetchProduk(); }, []);

  function addToCart(p: Produk) {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === p.id);
      if (existing) return prev.map((item) => item.productId === p.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { productId: p.id, namaProduk: p.nama, harga: p.hargaJual, qty: 1 }];
    });
  }

  function updateQty(productId: string, qty: number) {
    if (qty <= 0) { removeFromCart(productId); return; }
    setCart((prev) => prev.map((item) => item.productId === productId ? { ...item, qty } : item));
  }

  function removeFromCart(productId: string) {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  }

  function clearCart() {
    if (cart.length === 0) return;
    if (!confirm("Kosongkan keranjang?")) return;
    setCart([]);
  }

  async function handleBayar() {
    const bayar = parseInt(nominalBayar) || 0;
    if (bayar < total) { alert("Nominal bayar kurang dari total"); return; }
    setSaving(true);

    const res = await fetch("/api/transaksi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart.map((item) => ({ productId: item.productId, namaProduk: item.namaProduk, harga: item.harga, qty: item.qty, diskon: 0 })),
        metodeBayar, bayar, diskon: 0,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert(`Transaksi berhasil!\n\nNomor: ${data.nomor}\nTotal: ${formatRupiah(data.total)}\nKembalian: ${formatRupiah(data.kembalian)}`);
      setCart([]);
      setOpenBayar(false);
      setNominalBayar("");
      setMetodeBayar("cash");
    } else {
      alert(data.error || "Gagal menyimpan transaksi");
    }
    setSaving(false);
  }

  const total = cart.reduce((sum, item) => sum + item.harga * item.qty, 0);

  function formatRupiah(angka: number) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  }

  if (loading) return <div className="p-10 text-center text-slate-500">Memuat produk...</div>;

  return (
    <div className="h-full">
      {/* Render Mobile */}
      <KasirMobile 
        produk={produk} cart={cart} addToCart={addToCart} updateQty={updateQty} 
        removeFromCart={removeFromCart} clearCart={clearCart} total={total} onBayar={() => setOpenBayar(true)} 
      />

      {/* Render Desktop */}
      <KasirDesktop 
        produk={produk} cart={cart} addToCart={addToCart} updateQty={updateQty} 
        removeFromCart={removeFromCart} clearCart={clearCart} total={total} onBayar={() => setOpenBayar(true)} 
      />

      {/* Dialog Bayar (Sama untuk Mobile & Desktop) */}
      <Dialog open={openBayar} onOpenChange={setOpenBayar}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pembayaran</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-[#f6f7fb] p-4 rounded-xl border border-[#dde1ec]">
              <div className="text-sm text-slate-500">Total Belanja</div>
              <div className="text-3xl font-extrabold text-[#0b1230]">{formatRupiah(total)}</div>
            </div>
            <div>
              <Label>Metode Bayar</Label>
              <select value={metodeBayar} onChange={(e) => setMetodeBayar(e.target.value)} className="w-full border border-[#dde1ec] rounded-xl px-3 py-2.5 text-sm bg-white mt-1 focus:outline-none focus:border-[#c2410c]">
                <option value="cash">Tunai</option>
                <option value="qris">QRIS</option>
                <option value="debit">Debit / Kredit</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>
            <div>
              <Label htmlFor="nominal">Nominal Bayar *</Label>
              <Input id="nominal" type="number" value={nominalBayar} onChange={(e) => setNominalBayar(e.target.value)} placeholder={String(total)} autoFocus className="mt-1 h-12 text-lg" />
              <div className="flex gap-2 mt-2 flex-wrap">
                <button type="button" onClick={() => setNominalBayar(String(total))} className="text-xs px-3 py-1.5 bg-slate-100 rounded-lg font-semibold hover:bg-slate-200">Uang Pas</button>
                <button type="button" onClick={() => setNominalBayar(String(Math.ceil(total / 5000) * 5000))} className="text-xs px-3 py-1.5 bg-slate-100 rounded-lg font-semibold hover:bg-slate-200">Bulatkan 5rb</button>
              </div>
            </div>
            {nominalBayar && parseInt(nominalBayar) >= total && (
              <div className="bg-[#e6f6ec] p-3 rounded-xl border border-[#16a34a]/20">
                <div className="text-xs text-[#15803d]">Kembalian</div>
                <div className="text-xl font-bold text-[#15803d]">{formatRupiah(parseInt(nominalBayar) - total)}</div>
              </div>
            )}
            <Button className="w-full h-12 bg-[#c2410c] hover:bg-[#a83a0a] text-white font-bold rounded-xl" onClick={handleBayar} disabled={saving || !nominalBayar || parseInt(nominalBayar) < total}>
              {saving ? "Memproses..." : "Bayar Sekarang"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}