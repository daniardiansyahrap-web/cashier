"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
type StokItem = {
    id: string;
    nama: string;
    sku: string | null;
    satuan: string;
    stokMin: number;
    stok: number;
};

export default function StokPage() {
    const [produk, setProduk] = useState<StokItem[]>([]);
    const [outlet, setOutlet] = useState("");
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<StokItem | null>(null);
    const [tipe, setTipe] = useState("in");
    const [qty, setQty] = useState("");
    const [catatan, setCatatan] = useState("");
    const [saving, setSaving] = useState(false);

    async function fetchStok() {
        setLoading(true);
        const res = await fetch("/api/stok");
        const data = await res.json();
        setProduk(data.produk || []);
        setOutlet(data.outlet || "");
        setLoading(false);
    }

    useEffect(() => {
        fetchStok();
    }, []);

    function openForm(item: StokItem, mode: "in" | "out" | "opname") {
        setSelected(item);
        setTipe(mode);
        setQty(mode === "opname" ? String(item.stok) : "");
        setCatatan("");
        setOpen(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!selected) return;
        setSaving(true);

        const res = await fetch("/api/stok", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                productId: selected.id,
                tipe,
                qty: parseInt(qty),
                catatan,
            }),
        });

        const data = await res.json();

        if (res.ok) {
            setOpen(false);
            setSelected(null);
            setQty("");
            setCatatan("");
            fetchStok();
        } else {
            alert(data.error || "Gagal menyimpan");
        }

        setSaving(false);
    }

    const filtered = produk.filter(
        (p) =>
            p.nama.toLowerCase().includes(search.toLowerCase()) ||
            (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
    );

    const totalStokRendah = produk.filter((p) => p.stok <= p.stokMin).length;

    const tipeLabel = (t: string) => {
        if (t === "in") return "Stok Masuk";
        if (t === "out") return "Stok Keluar";
        return "Stock Opname";
    };

    return (
        <div className="p-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Manajemen Stok</h1>
                    <p className="text-gray-500 text-xs md:text-sm mt-1">
                        Outlet: {outlet || "-"}
                    </p>
                </div>
                <Link href="/stok/riwayat">
                    <Button variant="outline" size="sm" className="w-full md:w-auto">
                        Lihat Riwayat Pergerakan
                    </Button>
                </Link>
            </div>

            {/* Ringkasan — 1 baris compact */}
            <div className="bg-white border rounded-lg p-3 mb-4 flex items-center">
                <div className="flex-1 text-center">
                    <div className="text-[10px] md:text-xs text-gray-500">Total Produk</div>
                    <div className="text-lg md:text-xl font-bold">{produk.length}</div>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div className="flex-1 text-center">
                    <div className="text-[10px] md:text-xs text-gray-500">Stok Rendah</div>
                    <div className="text-lg md:text-xl font-bold text-red-600">
                        {totalStokRendah}
                    </div>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div className="flex-1 text-center">
                    <div className="text-[10px] md:text-xs text-gray-500">Total Unit</div>
                    <div className="text-lg md:text-xl font-bold">
                        {produk.reduce((sum, p) => sum + Math.max(p.stok, 0), 0)}
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                        <CardTitle className="text-base md:text-lg">Daftar Stok Produk</CardTitle>
                        <Input
                            placeholder="Cari produk"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full md:max-w-xs"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Memuat...</div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            {search ? "Produk tidak ditemukan" : "Belum ada produk"}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-xs md:text-sm">Nama</TableHead>
                                    <TableHead className="text-xs md:text-sm text-right">Stok</TableHead>
                                    <TableHead className="text-xs md:text-sm">Status</TableHead>
                                    <TableHead className="text-xs md:text-sm text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((p) => {
                                    const isLow = p.stok <= p.stokMin;
                                    return (
                                        <TableRow key={p.id}>
                                            <TableCell className="font-medium text-xs md:text-sm">
                                                <div>{p.nama}</div>
                                                <div className="text-[10px] md:text-xs text-gray-500">
                                                    {p.sku || "-"}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-xs md:text-sm">
                                                {p.stok} <span className="text-[10px] md:text-xs font-normal">{p.satuan}</span>
                                            </TableCell>
                                            <TableCell>
                                                {isLow ? (
                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] md:text-xs font-medium bg-red-100 text-red-800">
                                                        Rendah
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] md:text-xs font-medium bg-green-100 text-green-800">
                                                        Aman
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-1 justify-end">
                                                    <button
                                                        onClick={() => openForm(p, "in")}
                                                        className="w-7 h-7 rounded border text-green-600 hover:bg-green-50 text-sm font-bold"
                                                        title="Stok Masuk"
                                                    >
                                                        +
                                                    </button>
                                                    <button
                                                        onClick={() => openForm(p, "out")}
                                                        className="w-7 h-7 rounded border text-red-600 hover:bg-red-50 text-sm font-bold"
                                                        title="Stok Keluar"
                                                    >
                                                        −
                                                    </button>
                                                    <button
                                                        onClick={() => openForm(p, "opname")}
                                                        className="w-7 h-7 rounded border text-gray-600 hover:bg-gray-50 text-[10px] font-bold"
                                                        title="Opname"
                                                    >
                                                        =
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Dialog Form */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {tipeLabel(tipe)}: {selected?.nama}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-sm text-gray-600">Stok saat ini</div>
                            <div className="text-2xl font-bold">
                                {selected?.stok} {selected?.satuan}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="qty">
                                {tipe === "opname" ? "Stok Akhir (hasil hitung)" : "Jumlah"}
                            </Label>
                            <Input
                                id="qty"
                                type="number"
                                value={qty}
                                onChange={(e) => setQty(e.target.value)}
                                placeholder="0"
                                required
                                autoFocus
                            />
                        </div>

                        <div>
                            <Label htmlFor="catatan">Catatan (opsional)</Label>
                            <Input
                                id="catatan"
                                value={catatan}
                                onChange={(e) => setCatatan(e.target.value)}
                                placeholder={
                                    tipe === "in"
                                        ? "Pembelian dari supplier"
                                        : tipe === "out"
                                            ? "Rusak, expired, hilang"
                                            : "Hasil hitung fisik"
                                }
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={saving}>
                            {saving ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}