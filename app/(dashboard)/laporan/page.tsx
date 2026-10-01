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
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-start gap-3 mb-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold leading-tight">
            Laporan Penjualan
          </h1>
          <p className="text-gray-500 text-xs md:text-sm mt-0.5">
            Analisa performa penjualan toko kamu
          </p>
        </div>
        <Button onClick={exportCSV} disabled={!data} size="sm" className="shrink-0">
          CSV
        </Button>
      </div>

      {/* Filter Periode */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
        {[
          { value: "hari-ini", label: "Hari Ini" },
          { value: "7-hari", label: "7 Hari" },
          { value: "30-hari", label: "30 Hari" },
          { value: "bulan-ini", label: "Bulan Ini" },
        ].map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriode(p.value)}
            className={`px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition whitespace-nowrap shrink-0 ${
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
          <div className="bg-white border rounded-lg p-3 mb-3 grid grid-cols-4 divide-x divide-gray-200">
            <div className="text-center px-1">
              <div className="text-[10px] md:text-xs text-gray-500">Omzet</div>
              <div className="text-xs md:text-base font-bold text-blue-600 truncate">
                {formatRupiah(data.ringkasan.totalOmzet)}
              </div>
            </div>
            <div className="text-center px-1">
              <div className="text-[10px] md:text-xs text-gray-500">Transaksi</div>
              <div className="text-xs md:text-base font-bold">
                {data.ringkasan.totalTransaksi}
              </div>
            </div>
            <div className="text-center px-1">
              <div className="text-[10px] md:text-xs text-gray-500">Item</div>
              <div className="text-xs md:text-base font-bold">
                {data.ringkasan.totalItem}
              </div>
            </div>
            <div className="text-center px-1">
              <div className="text-[10px] md:text-xs text-gray-500">Rata-rata</div>
              <div className="text-xs md:text-base font-bold truncate">
                {formatRupiah(data.ringkasan.rataRata)}
              </div>
            </div>
          </div>

          {/* Produk Terlaris + Per Metode Bayar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
            {/* Produk Terlaris */}
            <Card className="flex flex-col">
              <CardHeader className="px-3 md:px-4 py-2 md:py-3">
                <CardTitle className="text-sm md:text-base">
                  Produk Terlaris
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 md:px-4 pt-0 pb-2">
                {data.produkTerlaris.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    Belum ada penjualan
                  </div>
                ) : (
                  <div className="max-h-52 overflow-y-auto pr-1 scrollbar-thin">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-white z-10">
                        <tr className="border-b">
                          <th className="text-left text-xs font-medium text-gray-500 py-2">
                            Produk
                          </th>
                          <th className="text-right text-xs font-medium text-gray-500 py-2">
                            Qty
                          </th>
                          <th className="text-right text-xs font-medium text-gray-500 py-2">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.produkTerlaris.map((p) => (
                          <tr key={p.productId} className="border-b last:border-0">
                            <td className="font-medium text-xs md:text-sm py-2">
                              {p.nama}
                            </td>
                            <td className="text-right font-bold text-xs md:text-sm py-2">
                              {p.qty}
                            </td>
                            <td className="text-right text-xs md:text-sm py-2">
                              {formatRupiah(p.total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Per Metode Bayar */}
            <Card className="flex flex-col">
              <CardHeader className="px-3 md:px-4 py-2 md:py-3">
                <CardTitle className="text-sm md:text-base">
                  Per Metode Bayar
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 md:px-4 pt-0 pb-2">
                {data.perMetode.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    Belum ada transaksi
                  </div>
                ) : (
                  <div className="max-h-52 overflow-y-auto pr-1 scrollbar-thin">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-white z-10">
                        <tr className="border-b">
                          <th className="text-left text-xs font-medium text-gray-500 py-2">
                            Metode
                          </th>
                          <th className="text-right text-xs font-medium text-gray-500 py-2">
                            Transaksi
                          </th>
                          <th className="text-right text-xs font-medium text-gray-500 py-2">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.perMetode.map((m) => (
                          <tr key={m.metode} className="border-b last:border-0">
                            <td className="font-medium text-xs md:text-sm py-2">
                              {metodeLabel(m.metode)}
                            </td>
                            <td className="text-right text-xs md:text-sm py-2">
                              {m.jumlah}
                            </td>
                            <td className="text-right text-xs md:text-sm py-2 font-bold">
                              {formatRupiah(m.total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Detail Transaksi */}
          <Card>
            <CardHeader className="px-3 md:px-4 py-2 md:py-3">
              <CardTitle className="text-sm md:text-base">
                Detail Transaksi ({data.transaksi.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 md:px-4 pt-0 pb-2">
              {data.transaksi.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm">
                  Belum ada transaksi di periode ini
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto pr-1 scrollbar-thin">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-white z-10">
                      <tr className="border-b">
                        <th className="text-left text-xs font-medium text-gray-500 py-2">
                          Nomor
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 py-2">
                          Waktu
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 py-2">
                          Item
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 py-2">
                          Metode
                        </th>
                        <th className="text-right text-xs font-medium text-gray-500 py-2">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.transaksi.map((t: any) => (
                        <tr key={t.id} className="border-b last:border-0">
                          <td className="font-mono text-[10px] md:text-xs py-2">
                            {t.nomor}
                          </td>
                          <td className="text-[10px] md:text-xs py-2">
                            {new Date(t.createdAt).toLocaleString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="text-xs md:text-sm py-2">
                            {t.items.reduce(
                              (s: number, i: any) => s + i.qty,
                              0
                            )}{" "}
                            item
                          </td>
                          <td className="text-xs md:text-sm py-2">
                            {metodeLabel(t.metodeBayar)}
                          </td>
                          <td className="text-right font-bold text-xs md:text-sm py-2">
                            {formatRupiah(t.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}