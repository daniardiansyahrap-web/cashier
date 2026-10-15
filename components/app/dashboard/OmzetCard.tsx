"use client";

import { useCountUp } from "@/lib/hooks/useCountUp";
import { rupiah } from "@/lib/format";

export function OmzetCard({
  omzetHariIni,
  omzetKemarin,
  jumlahTransaksi,
  itemTerjual,
  stokRendah,
}: {
  omzetHariIni: number;
  omzetKemarin: number;
  jumlahTransaksi: number;
  itemTerjual: number;
  stokRendah: number;
}) {
  const animatedOmzet = useCountUp(omzetHariIni, 1.2);

  let delta = 0;
  let deltaType: "naik" | "turun" | "sama" | "kosong" = "kosong";
  if (omzetKemarin > 0) {
    delta = ((omzetHariIni - omzetKemarin) / omzetKemarin) * 100;
    if (delta > 0) deltaType = "naik";
    else if (delta < 0) deltaType = "turun";
    else deltaType = "sama";
  }

  return (
    <div className="-mt-[46px] mx-[18px] lg:mt-0 lg:mx-0 bg-white rounded-[22px] lg:rounded-lg p-4 lg:p-6 shadow-cx-card lg:border lg:border-cx-line lg:h-full">
      {/* Label + delta */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-[12.5px] text-cx-muted">Omzet hari ini</span>
        {deltaType === "naik" && (
          <span className="text-[12px] font-bold text-cx-ok">
            ▲ {delta.toFixed(0)}% dari kemarin
          </span>
        )}
        {deltaType === "turun" && (
          <span className="text-[12px] font-bold text-cx-orange-d">
            ▼ {Math.abs(delta).toFixed(0)}% dari kemarin
          </span>
        )}
      </div>

      {/* Angka omzet */}
      <div className="text-[32px] lg:text-[36px] font-extrabold tracking-[-0.05em] text-cx-navy tabular-nums">
        {rupiah(animatedOmzet)}
      </div>

      {omzetHariIni === 0 && (
        <p className="text-[12px] text-cx-muted mt-1">
          Belum ada penjualan hari ini. Mulai dari Kasir.
        </p>
      )}

      {/* 3 ringkasan */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 pb-0 border-t border-cx-line">
        <div className="text-center">
          <div className="text-[11px] text-cx-muted mb-0.5">Transaksi</div>
          <div className="text-[15px] font-extrabold text-cx-navy tabular-nums">
            {jumlahTransaksi}
          </div>
        </div>
        <div className="text-center border-x border-cx-line">
          <div className="text-[11px] text-cx-muted mb-0.5">Item terjual</div>
          <div className="text-[15px] font-extrabold text-cx-navy tabular-nums">
            {itemTerjual}
          </div>
        </div>
        <div className="text-center">
          <div className="text-[11px] text-cx-muted mb-0.5">Stok rendah</div>
          <div
            className={`text-[15px] font-extrabold tabular-nums ${
              stokRendah > 0 ? "text-cx-orange-d" : "text-cx-navy"
            }`}
          >
            {stokRendah}
          </div>
        </div>
      </div>
    </div>
  );
}