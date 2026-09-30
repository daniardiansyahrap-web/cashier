"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Movement = {
  id: string;
  productId: string;
  tipe: string;
  qty: number;
  stokAwal: number;
  stokAkhir: number;
  catatan: string | null;
  referensi: string | null;
  createdAt: string;
  produk: {
    nama: string;
    sku: string | null;
    satuan: string;
  } | null;
};

export default function RiwayatStokPage() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterTipe, setFilterTipe] = useState("all");

  async function fetchData() {
    setLoading(true);
    const res = await fetch("/api/stok/riwayat");
    const data = await res.json();
    setMovements(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  function formatTanggal(iso: string) {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  }

  function tipeLabel(t: string) {
    const map: Record<string, string> = {
      in: "Stok Masuk",
      out: "Stok Keluar",
      opname: "Opname",
      sale: "Penjualan",
      void: "Void",
      transfer: "Transfer",
    };
    return map[t] || t;
  }

  function tipeColor(t: string) {
    const map: Record<string, string> = {
      in: "bg-green-100 text-green-800",
      out: "bg-red-100 text-red-800",
      sale: "bg-blue-100 text-blue-800",
      opname: "bg-yellow-100 text-yellow-800",
      void: "bg-gray-100 text-gray-800",
      transfer: "bg-purple-100 text-purple-800",
    };
    return map[t] || "bg-gray-100 text-gray-800";
  }

  const filtered = movements.filter((m) => {
    const matchSearch =
      m.produk?.nama.toLowerCase().includes(search.toLowerCase()) ||
      m.produk?.sku?.toLowerCase().includes(search.toLowerCase()) ||
      m.catatan?.toLowerCase().includes(search.toLowerCase());

    const matchTipe = filterTipe === "all" || m.tipe === filterTipe;

    return matchSearch && matchTipe;
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Riwayat Pergerakan Stok</h1>
          <p className="text-gray-500 text-sm mt-1">
            Semua pergerakan stok tercatat di sini (100 terakhir)
          </p>
        </div>
        <Link href="/stok">
          <Button variant="outline">← Kembali ke Stok</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center gap-4">
            <CardTitle>Pergerakan Stok</CardTitle>
            <div className="flex gap-2">
              <select
                value={filterTipe}
                onChange={(e) => setFilterTipe(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm bg-white w-40"
              >
                <option value="all">Semua Tipe</option>
                <option value="in">Stok Masuk</option>
                <option value="out">Stok Keluar</option>
                <option value="opname">Opname</option>
                <option value="sale">Penjualan</option>
              </select>
              <Input
                placeholder="Cari produk / catatan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-xs"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Memuat...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Belum ada pergerakan stok
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Produk</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Stok Awal → Akhir</TableHead>
                  <TableHead>Catatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="text-xs text-gray-600">
                      {formatTanggal(m.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">
                        {m.produk?.nama || "Produk dihapus"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {m.produk?.sku || "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex px-2 py-1 rounded text-xs font-medium ${tipeColor(
                          m.tipe
                        )}`}
                      >
                        {tipeLabel(m.tipe)}
                      </span>
                    </TableCell>
                    <TableCell
                      className={`text-right font-bold ${m.qty > 0
                          ? "text-green-600"
                          : m.qty < 0
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                    >
                      {m.qty > 0 ? "+" : ""}
                      {m.qty}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {m.stokAwal} → <span className="font-bold">{m.stokAkhir}</span>
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">
                      {m.catatan || "-"}
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