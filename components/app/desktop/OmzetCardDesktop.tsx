    "use client";

import { useCountUp } from "@/lib/hooks/useCountUp";
import { rupiah } from "@/lib/format";

export function OmzetCardDesktop({ data }: { data: any }) {
  const animatedOmzet = useCountUp(data.omzetHariIni, 1);

  let delta = 0;
  let deltaType: "naik" | "turun" | "kosong" = "kosong";
  if (data.omzetKemarin > 0) {
    delta = ((data.omzetHariIni - data.omzetKemarin) / data.omzetKemarin) * 100;
    if (delta > 0) deltaType = "naik";
    else if (delta < 0) deltaType = "turun";
  }

  return (
    <div className="flex flex-col min-w-0 bg-white border border-[#dde1ec] rounded-[10px] p-[22px] tabular-nums h-full">
      <div className="flex items-center justify-between gap-2 pb-3 mb-1 border-b border-[#eceef4]">
        <div>
          <h3 className="text-[13px] font-extrabold tracking-[-0.01em] text-[#0b1230]">
            Omzet hari ini
          </h3>
        </div>
        {deltaType === "naik" && (
          <span className="text-[11px] font-bold text-[#15803d]">
            ▲ {delta.toFixed(0)}% dari kemarin
          </span>
        )}
        {deltaType === "turun" && (
          <span className="text-[11px] font-bold text-[#c2410c]">
            ▼ {Math.abs(delta).toFixed(0)}% dari kemarin
          </span>
        )}
      </div>

      <div className="text-[36px] font-extrabold tracking-[-0.04em] leading-[1.15] mt-0.5 text-[#0b1230]">
        {rupiah(animatedOmzet)}
      </div>

      <p className="text-[11.5px] text-[#757895] mt-1">
        {data.omzetHariIni === 0
          ? "Belum ada penjualan hari ini. Mulai dari Kasir."
          : `${data.jumlahTransaksi} transaksi sejauh ini.`}
      </p>

      <div className="pt-2">
        <div className="grid grid-cols-3 border-t border-[#eceef4] pt-3.5">
          <div className="text-center">
            <div className="text-[11px] text-[#807d95] mb-1">Transaksi</div>
            <div className="text-[19px] font-extrabold text-[#0b1230]">
              {data.jumlahTransaksi}
            </div>
          </div>
          <div className="text-center border-l border-[#eceef4]">
            <div className="text-[11px] text-[#807d95] mb-1">Item terjual</div>
            <div className="text-[19px] font-extrabold text-[#0b1230]">
              {data.itemTerjual}
            </div>
          </div>
          <div className="text-center border-l border-[#eceef4]">
            <div className="text-[11px] text-[#807d95] mb-1">Stok rendah</div>
            <div
              className={`text-[19px] font-extrabold ${
                data.stokRendah > 0 ? "text-[#c2410c]" : "text-[#0b1230]"
              }`}
            >
              {data.stokRendah}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}