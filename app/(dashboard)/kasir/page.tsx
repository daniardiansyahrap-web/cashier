"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type Produk = {
    id: string;
    nama: string;
    sku: string | null;
    hargaJual: number;
    satuan: string;
};

type CartItem = {
    productId: string;
    namaProduk: string;
    harga: number;
    qty: number;
};

export default function KasirPage() {
    const [produk, setProduk] = useState<Produk[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState<CartItem[]>([]);
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

    useEffect(() => {
        fetchProduk();
    }, []);

    function addToCart(p: Produk) {
        setCart((prev) => {
            const existing = prev.find((item) => item.productId === p.id);
            if (existing) {
                return prev.map((item) =>
                    item.productId === p.id ? { ...item, qty: item.qty + 1 } : item
                );
            }
            return [
                ...prev,
                {
                    productId: p.id,
                    namaProduk: p.nama,
                    harga: p.hargaJual,
                    qty: 1,
                },
            ];
        });
    }

    function updateQty(productId: string, qty: number) {
        if (qty <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart((prev) =>
            prev.map((item) =>
                item.productId === productId ? { ...item, qty } : item
            )
        );
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

        if (bayar < total) {
            alert("Nominal bayar kurang dari total");
            return;
        }

        setSaving(true);

        const res = await fetch("/api/transaksi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                items: cart.map((item) => ({
                    productId: item.productId,
                    namaProduk: item.namaProduk,
                    harga: item.harga,
                    qty: item.qty,
                    diskon: 0,
                })),
                metodeBayar,
                bayar,
                diskon: 0,
            }),
        });

        const data = await res.json();

        if (res.ok) {
            alert(
                `Transaksi berhasil!\n\nNomor: ${data.nomor}\nTotal: ${formatRupiah(data.total)}\nKembalian: ${formatRupiah(data.kembalian)}`
            );
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
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(angka);
    }

    const filtered = produk.filter(
        (p) =>
            p.nama.toLowerCase().includes(search.toLowerCase()) ||
            (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="flex h-screen">
            {/* Kolom kiri: Grid Produk */}
            <div className="flex-1 p-6 overflow-auto">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold mb-3">Kasir</h1>
                    <Input
                        placeholder="Cari produk (nama / SKU)..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-md"
                    />
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-500">Memuat...</div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        {search ? "Produk tidak ditemukan" : "Belum ada produk"}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {filtered.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => addToCart(p)}
                                className="text-left p-4 border rounded-lg hover:border-blue-500 hover:shadow-md transition bg-white"
                            >
                                <div className="font-medium text-sm mb-1 line-clamp-2">
                                    {p.nama}
                                </div>
                                <div className="text-xs text-gray-500 mb-2">
                                    {p.sku || "-"}
                                </div>
                                <div className="text-blue-600 font-bold">
                                    {formatRupiah(p.hargaJual)}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Kolom kanan: Keranjang */}
            <div className="w-96 border-l bg-white flex flex-col">
                <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-lg">Keranjang</h2>
                        {cart.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearCart}
                                className="text-red-600"
                            >
                                Kosongkan
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-4">
                    {cart.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 text-sm">
                            Keranjang kosong
                            <br />
                            Klik produk untuk menambahkan
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {cart.map((item) => (
                                <div
                                    key={item.productId}
                                    className="border rounded-lg p-3 bg-gray-50"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-medium text-sm flex-1">
                                            {item.namaProduk}
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.productId)}
                                            className="text-red-500 text-xs hover:underline"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() =>
                                                    updateQty(item.productId, item.qty - 1)
                                                }
                                                className="w-7 h-7 rounded border bg-white hover:bg-gray-100"
                                            >
                                                −
                                            </button>
                                            <span className="w-8 text-center text-sm font-medium">
                                                {item.qty}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    updateQty(item.productId, item.qty + 1)
                                                }
                                                className="w-7 h-7 rounded border bg-white hover:bg-gray-100"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="text-sm font-bold">
                                            {formatRupiah(item.harga * item.qty)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="border-t p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-600">Total</span>
                        <span className="text-2xl font-bold text-blue-600">
                            {formatRupiah(total)}
                        </span>
                    </div>
                            <Button
          className="w-full h-12 text-base"
          disabled={cart.length === 0}
          onClick={() => setOpenBayar(true)}
        >
          Bayar ({cart.length} item)
        </Button>
    </div>
        </div>

      {/* Dialog Bayar */}
      <Dialog open={openBayar} onOpenChange={setOpenBayar}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pembayaran</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Total */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Total Belanja</div>
              <div className="text-3xl font-bold text-blue-600">
                {formatRupiah(total)}
              </div>
            </div>

            {/* Metode Bayar */}
            <div>
              <Label>Metode Bayar</Label>
                            <Select
                                value={metodeBayar}
                                onValueChange={(value) => value && setMetodeBayar(value)}
                            >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Tunai</SelectItem>
                  <SelectItem value="qris">QRIS</SelectItem>
                  <SelectItem value="debit">Debit / Kredit</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Nominal Bayar */}
            <div>
              <Label htmlFor="nominal">Nominal Bayar *</Label>
              <Input
                id="nominal"
                type="number"
                value={nominalBayar}
                onChange={(e) => setNominalBayar(e.target.value)}
                placeholder={String(total)}
                autoFocus
              />
              {/* Tombol cepat */}
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setNominalBayar(String(total))}
                  className="text-xs px-3 py-1 border rounded hover:bg-gray-100"
                >
                  Uang Pas
                </button>
                <button
                  type="button"
                  onClick={() => setNominalBayar(String(Math.ceil(total / 5000) * 5000))}
                  className="text-xs px-3 py-1 border rounded hover:bg-gray-100"
                >
                  Bulatkan 5rb
                </button>
                <button
                  type="button"
                  onClick={() => setNominalBayar(String(Math.ceil(total / 10000) * 10000))}
                  className="text-xs px-3 py-1 border rounded hover:bg-gray-100"
                >
                  Bulatkan 10rb
                </button>
              </div>
            </div>

            {/* Kembalian */}
            {nominalBayar && parseInt(nominalBayar) >= total && (
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Kembalian</div>
                <div className="text-xl font-bold text-green-600">
                  {formatRupiah(parseInt(nominalBayar) - total)}
                </div>
              </div>
            )}

            {/* Tombol */}
            <Button
              className="w-full h-12"
              onClick={handleBayar}
              disabled={saving || !nominalBayar || parseInt(nominalBayar) < total}
            >
              {saving ? "Memproses..." : "Bayar Sekarang"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}