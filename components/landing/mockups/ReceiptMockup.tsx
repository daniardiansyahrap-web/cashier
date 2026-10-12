"use client";

import { motion } from "framer-motion";

const items = [
  { nama: "Indomie Goreng", qty: 2, harga: 3500 },
  { nama: "Teh Botol Sosro", qty: 1, harga: 5000 },
];

export function ReceiptMockup() {
  const subtotal = items.reduce((sum, i) => sum + i.qty * i.harga, 0);
  const pajak = Math.round(subtotal * 0.11);
  const total = subtotal + pajak;

  function formatRupiah(angka: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  }

  return (
    <motion.div
      initial={{ y: -100, opacity: 0, rotate: -5 }}
      animate={{ y: 0, opacity: 1, rotate: -2 }}
      transition={{ duration: 0.8, delay: 1 }}
      className="w-[180px] bg-white shadow-2xl"
      style={{
        clipPath:
          "polygon(0 0, 100% 0, 100% calc(100% - 10px), 95% 100%, 90% calc(100% - 10px), 85% 100%, 80% calc(100% - 10px), 75% 100%, 70% calc(100% - 10px), 65% 100%, 60% calc(100% - 10px), 55% 100%, 50% calc(100% - 10px), 45% 100%, 40% calc(100% - 10px), 35% 100%, 30% calc(100% - 10px), 25% 100%, 20% calc(100% - 10px), 15% 100%, 10% calc(100% - 10px), 5% 100%, 0 calc(100% - 10px))",
      }}
    >
      <div className="p-4 font-mono text-[8px] leading-tight text-slate-800">
        <div className="text-center mb-3">
          <div className="font-bold text-[10px]">TOKO BERKAH JAYA</div>
          <div className="text-[7px] text-slate-500">
            Jl. Merdeka No. 123, Jakarta
          </div>
          <div className="text-[7px] text-slate-500">
            ─────────────────
          </div>
        </div>

        <div className="space-y-1 mb-2">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5 + idx * 0.2 }}
            >
              <div className="flex justify-between">
                <span>{item.nama}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>
                  {item.qty} x {formatRupiah(item.harga)}
                </span>
                <span>{formatRupiah(item.qty * item.harga)}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-dashed border-slate-300 pt-2 space-y-1">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatRupiah(subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>PPN 11%</span>
            <span>{formatRupiah(pajak)}</span>
          </div>
          <div className="flex justify-between font-bold text-[10px] pt-1 border-t border-slate-300">
            <span>TOTAL</span>
            <span>{formatRupiah(total)}</span>
          </div>
        </div>

        <div className="text-center mt-3 text-[7px] text-slate-500">
          <div>Terima kasih 🙏</div>
          <div>Barang yang sudah dibeli</div>
          <div>tidak dapat dikembalikan</div>
        </div>
      </div>
    </motion.div>
  );
}