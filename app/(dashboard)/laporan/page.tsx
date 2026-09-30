"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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

type LaporanData = {
  periode: string;
  startDate: string;
  endDate: string;
  ringkasan: {
    totalOmzet: number;
    totalTransaksi: number;
    totalItem: number;
    rataRata: number;
  };
  perMetode: { metode: string; jumlah: number; total: number }[];
  produkTerlaris: {
    productId: string;
    nama: string;
    qty: number;
    total: number;
  }[];
  transaksi: any[];
};

export default function LaporanPage() {
  const [periode, setPeriode] = useState("hari-ini");
  const [data, setData] = useState<LaporanData | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    setLoading(true);
    const res = await fetch(`/api/laporan?periode=${periode}`);
    const result = await res.json();
    setData(result);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [periode]);

  function formatRupiah(angka: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
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

  function exportCSV() {
    if (!data) return;

    const rows: string[][] = [
      ["Laporan Penjualan"],
      ["Periode", data.periode],
      ["Dari", new Date(data.startDate).toLocaleString("id-ID")],
      ["Sampai", new Date(data.endDate).toLocaleString("id-ID")],
      [],
      ["RINGKASAN"],
      ["Total Omzet", String(data.ringkasan.totalOmzet)],
      ["Total Transaksi", String(data.ringkasan.totalTransaksi)],
      ["Total Item Terjual", String(data.ringkasan.totalItem)],
      ["Rata-rata per Transaksi", String(Math.round(data.ringkasan.rataRata))],
      [],
      ["PRODUK TERLARIS"],
      ["Produk", "Qty Terjual", "Total"],
      ...data.produkTerlaris.map((p) => [p.nama, String(p.qty), String(p.total)]),
      [],
      ["PER METODE BAYAR"],
      ["Metode", "Jumlah Transaksi", "Total"],
      ...data.perMetode.map((m) => [
        metodeLabel(m.metode),
        String(m.jumlah),
        String(m.total),
      ]),
    ];

    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `laporan-${periode}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Laporan Penjualan</h1>
          <p className="text-gray-500 text-sm mt-1">
            Analisa performa penjualan toko kamu
          </p>
        </div>
        <Button onClick={exportCSV} disabled={!data}>
          📥 Export CSV
        </Button>
      </div>

      {/* Filter Periode */}
      <div className="flex gap-2 mb-6">
        {[
          { value: "hari-ini", label: "Hari Ini" },
          { value: "7-hari", label: "7 Hari Terakhir" },
          { value: "30-hari", label: "30 Hari Terakhir" },
          { value: "bulan-ini", label: "Bulan Ini" },
        ].map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriode(p.value)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              periode === p.value
                ? "bg-black text-white"
                : "bg-white border hover:bg-gray-50"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Memuat...</div>
      ) : !data ? (
        <div className="text-center py-12 text-gray-500">
          Gagal memuat data
        </div>
      ) : (
        <>
          {/* Ringkasan */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 font-normal">
                  Total Omzet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {formatRupiah(data.ringkasan.totalOmzet)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 font-normal">
                  Total Transaksi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.ringkasan.totalTransaksi}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 font-normal">
                  Item Terjual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.ringkasan.totalItem}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 font-normal">
                  Rata-rata / Transaksi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatRupiah(data.ringkasan.rataRata)}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Produk Terlaris */}
            <Card>
              <CardHeader>
                <CardTitle>Produk Terlaris</CardTitle>
              </CardHeader>
              <CardContent>
                {data.produkTerlaris.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    Belum ada penjualan
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produk</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.produkTerlaris.map((p) => (
                        <TableRow key={p.productId}>
                          <TableCell className="font-medium text-sm">
                            {p.nama}
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {p.qty}
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {formatRupiah(p.total)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Per Metode Bayar */}
            <Card>
              <CardHeader>
                <CardTitle>Per Metode Bayar</CardTitle>
              </CardHeader>
              <CardContent>
                {data.perMetode.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    Belum ada transaksi
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Metode</TableHead>
                        <TableHead className="text-right">Transaksi</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.perMetode.map((m) => (
                        <TableRow key={m.metode}>
                          <TableCell className="font-medium text-sm">
                            {metodeLabel(m.metode)}
                          </TableCell>
                          <TableCell className="text-right">
                            {m.jumlah}
                          </TableCell>
                          <TableCell className="text-right text-sm font-bold">
                            {formatRupiah(m.total)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Daftar Transaksi */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>
                Detail Transaksi ({data.transaksi.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.transaksi.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  Belum ada transaksi di periode ini
                </div>
              ) : (
                <div className="max-h-96 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nomor</TableHead>
                        <TableHead>Waktu</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Metode</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.transaksi.map((t: any) => (
                        <TableRow key={t.id}>
                          <TableCell className="font-mono text-xs">
                            {t.nomor}
                          </TableCell>
                          <TableCell className="text-xs">
                            {new Date(t.createdAt).toLocaleString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </TableCell>
                          <TableCell className="text-sm">
                            {t.items.reduce(
                              (s: number, i: any) => s + i.qty,
                              0
                            )}{" "}
                            item
                          </TableCell>
                          <TableCell className="text-sm">
                            {metodeLabel(t.metodeBayar)}
                          </TableCell>
                          <TableCell className="text-right font-bold text-sm">
                            {formatRupiah(t.total)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}