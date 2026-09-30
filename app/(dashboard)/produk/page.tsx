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

type Produk = {
  id: string;
  nama: string;
  sku: string | null;
  barcode: string | null;
  hargaJual: number;
  hargaBeli: number | null;
  satuan: string;
  stokMin: number;
};

export default function ProdukPage() {
  const [produk, setProduk] = useState<Produk[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({

    nama: "",
    sku: "",
    barcode: "",
    hargaJual: "",
    hargaBeli: "",
    satuan: "pcs",
    stokMin: "0",
  });
  const emptyForm = {
    nama: "",
    sku: "",
    barcode: "",
    hargaJual: "",
    hargaBeli: "",
    satuan: "pcs",
    stokMin: "0",
  };

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

  function openTambah() {
    setEditId(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(p: Produk) {
    setEditId(p.id);
    setForm({
      nama: p.nama,
      sku: p.sku || "",
      barcode: p.barcode || "",
      hargaJual: String(p.hargaJual),
      hargaBeli: p.hargaBeli ? String(p.hargaBeli) : "",
      satuan: p.satuan,
      stokMin: String(p.stokMin),
    });
    setOpen(true);
  }

 async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setSaving(true);

  const url = editId ? `/api/produk/${editId}` : "/api/produk";
  const method = editId ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });

  if (res.ok) {
    setOpen(false);
    setEditId(null);
    setForm(emptyForm);
    fetchProduk();
  } else {
    const data = await res.json();
    alert(data.error || (editId ? "Gagal mengupdate produk" : "Gagal menyimpan produk"));
  }

  setSaving(false);
}

  async function handleDelete(id: string, nama: string) {
    if (!confirm(`Yakin hapus produk "${nama}"?`)) return;

    const res = await fetch(`/api/produk/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchProduk();
    } else {
      alert("Gagal menghapus produk");
    }
  }

  function formatRupiah(angka: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Produk</h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola daftar produk toko kamu
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <Button onClick={openTambah}>+ Tambah Produk</Button>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editId ? "Edit Produk" : "Tambah Produk Baru"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nama">Nama Produk *</Label>
                <Input
                  id="nama"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  placeholder="Indomie Goreng"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    placeholder="SKU-001"
                  />
                </div>
                <div>
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input
                    id="barcode"
                    value={form.barcode}
                    onChange={(e) =>
                      setForm({ ...form, barcode: e.target.value })
                    }
                    placeholder="899123..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="hargaJual">Harga Jual *</Label>
                  <Input
                    id="hargaJual"
                    type="number"
                    value={form.hargaJual}
                    onChange={(e) =>
                      setForm({ ...form, hargaJual: e.target.value })
                    }
                    placeholder="3500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="hargaBeli">Harga Beli</Label>
                  <Input
                    id="hargaBeli"
                    type="number"
                    value={form.hargaBeli}
                    onChange={(e) =>
                      setForm({ ...form, hargaBeli: e.target.value })
                    }
                    placeholder="2800"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="satuan">Satuan</Label>
                  <Input
                    id="satuan"
                    value={form.satuan}
                    onChange={(e) =>
                      setForm({ ...form, satuan: e.target.value })
                    }
                    placeholder="pcs"
                  />
                </div>
                <div>
                  <Label htmlFor="stokMin">Stok Minimum</Label>
                  <Input
                    id="stokMin"
                    type="number"
                    value={form.stokMin}
                    onChange={(e) =>
                      setForm({ ...form, stokMin: e.target.value })
                    }
                    placeholder="0"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? "Menyimpan..." : editId ? "Update Produk" : "Simpan Produk"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Produk ({produk.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Memuat...</div>
          ) : produk.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Belum ada produk. Klik "Tambah Produk" untuk mulai.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Harga Jual</TableHead>
                  <TableHead>Harga Beli</TableHead>
                  <TableHead>Satuan</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produk.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.nama}</TableCell>
                    <TableCell>{p.sku || "-"}</TableCell>
                    <TableCell>{formatRupiah(p.hargaJual)}</TableCell>
                    <TableCell>
                      {p.hargaBeli ? formatRupiah(p.hargaBeli) : "-"}
                    </TableCell>
                    <TableCell>{p.satuan}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(p)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(p.id, p.nama)}
                      >
                        Hapus
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}