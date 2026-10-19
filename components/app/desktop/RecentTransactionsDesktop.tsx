"use client";

import Link from "next/link";
import { rupiah } from "@/lib/format";

type Trx = {
  id: string;
  nomor: string;
  total: number;
  metodeBayar: string;
  createdAt: Date;
  items: { qty: number }[];
};

function formatTanggal(d: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(d));
}

function metodeLabel(m: string) {
  const map: Record<string, string> = {
    cash: "Tunai",
    qris: "QRIS",
    debit: "Debit",
    transfer: "Transfer",
  };
  return map[m] || m;
}

export function RecentTransactionsDesktop({ transactions }: { transactions: Trx[] }) {
  const isEmpty = transactions.length === 0;

  return (
    <div className="flex flex-col min-w-0 bg-white border border-[#dde1ec] rounded-[10px] p-[22px] h-full tabular-nums">
      <div className="flex items-center justify-between ">
        <h3 className="text-[13px] font-extrabold tracking-[-0.01em] text-[#0b1230]">
          Transaksi terbaru
        </h3>
        <Link href="/transaksi" className="text-[11px] font-bold text-[#c2410c]">
          Lihat semua ›
        </Link>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-10 mt-2 border-t border-dashed border-[#d6dbe8]">
          <div className="text-[12.5px] font-bold text-[#0b1230]">Nota pertama akan tercatat di sini</div>
          <div className="text-[11.5px] text-[#757895] mt-1 mb-3">Setiap penjualan di Kasir langsung muncul.</div>
          <Link href="/kasir" className="h-8 px-4 rounded-lg bg-[#c2410c] text-xs font-bold text-white flex items-center justify-center hover:bg-[#a83a0a] transition-colors">
            Buka Kasir
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {/* Header Tabel */}
          <div className="grid grid-cols-[33%_17%_17%_15%_18%] mt-4 h-[28px] items-center border-b border-[#e3e6ef] text-[11px] font-bold text-[#5e6888] px-2">
            <span>NO. STRUK</span>
            <span>WAKTU</span>
            <span>ITEM</span>
            <span className="text-right">TOTAL</span>
            <span className="text-right">STATUS</span>
          </div>

          {/* Baris Data */}
          <div className="flex flex-col">
            {transactions.map((t) => (
              <Link
                key={t.id}
                href={`/transaksi`} // Sesuaikan link detail kalau ada
                className="grid grid-cols-[33%_17%_17%_15%_18%] h-[40px] items-center text-[12px] border-b border-[#eef0f6] last:border-0 hover:bg-[#f7f8fc] transition-colors px-2 rounded-md"
              >
                <span className="font-mono text-[#0b1230]">{t.nomor}</span>
                <span className="text-[#757895]">{formatTanggal(t.createdAt)}</span>
                <span className="text-[#757895]">{t.items.reduce((s, i) => s + i.qty, 0)} item</span>
                <span className="text-right font-bold text-[#0b1230]">{rupiah(t.total)}</span>
                <span className="text-right">
                  <span
                    className={`inline-flex items-center text-[10px] font-bold ${t.metodeBayar === "cash"
                        ? "text-[#15803d]"
                        : t.metodeBayar === "qris"
                          ? "text-[#1d4ed8]"
                          : "text-[#656686]"
                      }`}
                  >
                    {metodeLabel(t.metodeBayar)}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}