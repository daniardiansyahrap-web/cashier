"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Menu, X, ShoppingCart } from "lucide-react";

type Produk = {
    id: string;
    nama: string;
    sku: string | null;
    barcode: string | null;
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
    const [cartOpen, setCartOpen] = useState(false);
    const [openBayar, setOpenBayar] = useState(false);
    const [metodeBayar, setMetodeBayar] = useState("cash");
    const [nominalBayar, setNominalBayar] = useState("");
    const [saving, setSaving] = useState(false);
    const [barcode, setBarcode] = useState("");
    const [barcodeMsg, setBarcodeMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

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

    function handleBarcodeSubmit(e: React.FormEvent) {
        e.preventDefault();
        const code = barcode.trim();
        if (!code) return;

        // Cari produk berdasarkan barcode atau SKU
        const found = produk.find(
            (p) =>
                p.barcode?.toLowerCase() === code.toLowerCase() ||
                p.sku?.toLowerCase() === code.toLowerCase()
        );

        if (found) {
            addToCart(found);
            setBarcodeMsg({
                text: `✓ ${found.nama} ditambahkan`,
                type: "success",
            });
            setBarcode("");
            // Auto-hide message setelah 2 detik
            setTimeout(() => setBarcodeMsg(null), 2000);
        } else {
            setBarcodeMsg({
                text: `✗ Barcode "${code}" tidak ditemukan`,
                type: "error",
            });
            setBarcode("");
            setTimeout(() => setBarcodeMsg(null), 2500);
        }
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
                `Transaksi berhasil!\n\nNomor: ${data.nomor}\nTotal: ${formatRupiah(
                    data.total
                )}\nKembalian: ${formatRupiah(data.kembalian)}`
            );
            setCart([]);
            setOpenBayar(false);
            setNominalBayar("");
            setMetodeBayar("cash");
            setCartOpen(false);
        } else {
            alert(data.error || "Gagal menyimpan transaksi");
        }
        setSaving(false);
    }

    const total = cart.reduce((sum, item) => sum + item.harga * item.qty, 0);
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

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
        <div className="flex h-full relative">
            {/* Kolom kiri: Grid Produk */}
            <div className="flex-1 p-4 lg:p-6 overflow-auto">
                <div className="mb-4 space-y-3">
                    <h1 className="text-xl lg:text-2xl font-bold">Kasir</h1>

                    {/* Input Barcode — auto focus */}
                    <form onSubmit={handleBarcodeSubmit} className="max-w-md">
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                📷
                            </div>
                            <Input
                                placeholder="Scan barcode / ketik manual..."
                                value={barcode}
                                onChange={(e) => setBarcode(e.target.value)}
                                className="pl-9 text-base"
                                autoFocus
                            />
                        </div>

                        {/* Pesan feedback */}
                        {barcodeMsg && (
                            <div
                                className={`mt-2 text-sm px-3 py-2 rounded-lg ${barcodeMsg.type === "success"
                                        ? "bg-green-50 text-green-700"
                                        : "bg-red-50 text-red-700"
                                    }`}
                            >
                                {barcodeMsg.text}
                            </div>
                        )}
                    </form>

                    {/* Input Search Biasa */}
                    <Input
                        placeholder="Cari produk (nama / SKU)..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-md"
                    />
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-500">Memuat</div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        {search ? "Produk tidak ditemukan" : "Belum ada produk"}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-3">
                        {filtered.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => addToCart(p)}
                                className="text-left p-3 lg:p-4 border rounded-lg hover:border-blue-500 hover:shadow-md transition bg-white"
                            >
                                <div className="font-medium text-xs lg:text-sm mb-1 line-clamp-2">
                                    {p.nama}
                                </div>
                                <div className="text-[10px] lg:text-xs text-gray-500 mb-2">
                                    {p.sku || "-"}
                                </div>
                                <div className="text-blue-600 font-bold text-sm lg:text-base">
                                    {formatRupiah(p.hargaJual)}
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Spacer bawah biar konten gak ketutupan tombol keranjang di mobile */}
                <div className="lg:hidden h-20" />
            </div>

            {/* Tombol Floating Keranjang (mobile only) */}
            <button
                onClick={() => setCartOpen(true)}
                className="lg:hidden fixed bottom-4 right-4 z-30 bg-blue-600 text-white rounded-full px-5 py-3 shadow-lg flex items-center gap-2 font-medium"
            >
                <ShoppingCart className="w-5 h-5" />
                {totalQty > 0 && (
                    <span className="bg-white text-blue-600 rounded-full px-2 text-xs font-bold">
                        {totalQty}
                    </span>
                )}
            </button>

            {/* Overlay mobile */}
            {cartOpen && (
                <div
                    onClick={() => setCartOpen(false)}
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                />
            )}

            {/* Kolom kanan: Keranjang */}
            <div
                className={`bg-white flex flex-col fixed lg:sticky bottom-0 lg:top-0 right-0 left-0 lg:left-auto z-50 w-full lg:w-96 rounded-t-2xl lg:rounded-none max-h-[70vh] lg:max-h-none lg:h-screen border-t lg:border-l lg:border-t-0 transform transition-transform duration-300 ${cartOpen ? "translate-y-0 lg:translate-x-0" : "translate-y-full lg:translate-x-0 lg:translate-y-0"
                    }`}
            >
                <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-lg">Keranjang</h2>
                        <div className="flex gap-2">
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
                            <button
                                onClick={() => setCartOpen(false)}
                                className="lg:hidden p-1 rounded hover:bg-gray-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
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
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-600">Total Belanja</div>
                            <div className="text-3xl font-bold text-blue-600">
                                {formatRupiah(total)}
                            </div>
                        </div>

                        <div>
                            <Label>Metode Bayar</Label>
                            <select
                                value={metodeBayar}
                                onChange={(e) => setMetodeBayar(e.target.value)}
                                className="w-full border rounded-md px-3 py-2 text-sm bg-white mt-1"
                            >
                                <option value="cash">Tunai</option>
                                <option value="qris">QRIS</option>
                                <option value="debit">Debit / Kredit</option>
                                <option value="transfer">Transfer</option>
                            </select>
                        </div>

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
                            <div className="flex gap-2 mt-2 flex-wrap">
                                <button
                                    type="button"
                                    onClick={() => setNominalBayar(String(total))}
                                    className="text-xs px-3 py-1 border rounded hover:bg-gray-100"
                                >
                                    Uang Pas
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setNominalBayar(String(Math.ceil(total / 5000) * 5000))
                                    }
                                    className="text-xs px-3 py-1 border rounded hover:bg-gray-100"
                                >
                                    Bulatkan 5rb
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setNominalBayar(String(Math.ceil(total / 10000) * 10000))
                                    }
                                    className="text-xs px-3 py-1 border rounded hover:bg-gray-100"
                                >
                                    Bulatkan 10rb
                                </button>
                            </div>
                        </div>

                        {nominalBayar && parseInt(nominalBayar) >= total && (
                            <div className="bg-green-50 p-3 rounded-lg">
                                <div className="text-sm text-gray-600">Kembalian</div>
                                <div className="text-xl font-bold text-green-600">
                                    {formatRupiah(parseInt(nominalBayar) - total)}
                                </div>
                            </div>
                        )}

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