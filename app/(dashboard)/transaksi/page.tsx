"use client";

import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TransactionItem = {
  id: string;
  namaProduk: string;
  qty: number;
  harga: number;
  diskon: number;
  subtotal: number;
};

type Transaksi = {
  id: string;
  nomor: string;
  subtotal: number;
  diskon: number;
  total: number;
  metodeBayar: string;
  bayar: number;
  kembalian: number;
  status: string;
  catatan: string | null;
  createdAt: string;
  items: TransactionItem[];
};

export default function TransaksiPage() {
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Transaksi | null>(null);

  async function fetchTransaksi() {
    setLoading(true);
    const res = await fetch("/api/transaksi");
    const data = await res.json();
    setTransaksi(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchTransaksi();
  }, []);

  function formatRupiah(angka: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  }

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

  function metodeLabel(m: string) {
    const map: Record<string, string> = {
      cash: "Tunai",
      qris: "QRIS",
      debit: "Debit/Kredit",
      transfer: "Transfer",
    };
    return map[m] || m;
  }

  const filtered = transaksi.filter(
    (t) =>
      t.nomor.toLowerCase().includes(search.toLowerCase()) ||
      t.metodeBayar.toLowerCase().includes(search.toLowerCase())
  );

  const totalHariIni = transaksi
    .filter((t) => {
      const today = new Date().toDateString();
      const tgl = new Date(t.createdAt).toDateString();
      return today === tgl;
    })
    .reduce((sum, t) => sum + t.total, 0);

  return (
    <div className="p-8">
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold">Riwayat Transaksi</h1>
        <p className="text-gray-500 text-xs md:text-sm mt-1">
          Daftar semua transaksi yang pernah terjadi
        </p>
      </div>

      {/* Ringkasan — 1 baris compact */}
      <div className="bg-white border rounded-lg p-3 mb-4 flex items-center">
        <div className="flex-1 text-center">
          <div className="text-[10px] md:text-xs text-gray-500">Total Transaksi</div>
          <div className="text-lg md:text-xl font-bold">{transaksi.length}</div>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div className="flex-1 text-center">
          <div className="text-[10px] md:text-xs text-gray-500">Penjualan Hari Ini</div>
          <div className="text-lg md:text-xl font-bold text-blue-600">
            {formatRupiah(totalHariIni)}
          </div>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div className="flex-1 text-center">
          <div className="text-[10px] md:text-xs text-gray-500">Item Terjual</div>
          <div className="text-lg md:text-xl font-bold">
            {transaksi
              .filter((t) => {
                const today = new Date().toDateString();
                const tgl = new Date(t.createdAt).toDateString();
                return today === tgl;
              })
              .reduce(
                (sum, t) => sum + t.items.reduce((s, item) => s + item.qty, 0),
                0
              )}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
            <CardTitle className="text-base md:text-lg">Daftar Transaksi</CardTitle>
            <Input
              placeholder="Cari no transaksi"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:max-w-xs"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Memuat</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {search
                ? "Tidak ada transaksi yang cocok"
                : "Belum ada transaksi"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nomor</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Metode</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-mono text-sm">
                      {t.nomor}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatTanggal(t.createdAt)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {t.items.reduce((s, item) => s + item.qty, 0)} item
                    </TableCell>
                    <TableCell className="text-sm">
                      {metodeLabel(t.metodeBayar)}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {formatRupiah(t.total)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelected(t)}
                      >
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog Detail */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detail Transaksi</DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Nomor Transaksi</div>
                <div className="font-mono font-bold">{selected.nomor}</div>
                <div className="text-xs text-gray-500 mt-2">
                  {formatTanggal(selected.createdAt)}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Item:</div>
                <div className="space-y-2 max-h-60 overflow-auto">
                  {selected.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm border-b pb-2"
                    >
                      <div>
                        <div className="font-medium">{item.namaProduk}</div>
                        <div className="text-xs text-gray-500">
                          {item.qty} × {formatRupiah(item.harga)}
                        </div>
                      </div>
                      <div className="font-medium">
                        {formatRupiah(item.subtotal)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatRupiah(selected.subtotal)}</span>
                </div>
                {selected.diskon > 0 && (
                  <div className="flex justify-between text-sm text-red-600">
                    <span>Diskon</span>
                    <span>- {formatRupiah(selected.diskon)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-blue-600">
                    {formatRupiah(selected.total)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Metode</span>
                  <span>{metodeLabel(selected.metodeBayar)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Bayar</span>
                  <span>{formatRupiah(selected.bayar)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Kembalian</span>
                  <span>{formatRupiah(selected.kembalian)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}