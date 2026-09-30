"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Manajemen Stok</h1>
        <p className="text-gray-500 text-sm mt-1">
          Outlet: {outlet || "-"}
        </p>
      </div>

      {/* Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-normal">
              Total Produk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{produk.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-normal">
              Stok Rendah
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {totalStokRendah}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-normal">
              Total Nilai Stok
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {produk.reduce((sum, p) => sum + Math.max(p.stok, 0), 0)} unit
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Daftar Stok Produk</CardTitle>
            <Input
              placeholder="Cari produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
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
                  <TableHead>Nama</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Stok</TableHead>
                  <TableHead className="text-right">Min</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => {
                  const isLow = p.stok <= p.stokMin;
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.nama}</TableCell>
                      <TableCell className="text-sm">{p.sku || "-"}</TableCell>
                      <TableCell className="text-right font-bold">
                        {p.stok} {p.satuan}
                      </TableCell>
                      <TableCell className="text-right text-sm text-gray-500">
                        {p.stokMin}
                      </TableCell>
                      <TableCell>
                        {isLow ? (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                            Stok Rendah
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                            Aman
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openForm(p, "in")}
                        >
                          + Masuk
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openForm(p, "out")}
                        >
                          − Keluar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openForm(p, "opname")}
                        >
                          Opname
                        </Button>
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