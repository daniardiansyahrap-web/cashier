"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Day = { label: string; total: number; isToday: boolean };

export function SalesChartDesktop({ 
  data7Hari, 
  data30Hari 
}: { 
  data7Hari: Day[]; 
  data30Hari: Day[]; 
}) {
  const reduce = useReducedMotion();
  const [period, setPeriod] = useState<"7" | "30">("7");
  
  const displayData = period === "7" ? data7Hari : data30Hari;
  const max = Math.max(...displayData.map((d) => d.total), 1);
  const isEmpty = displayData.every((d) => d.total === 0);

  return (
    <div className="flex flex-col min-w-0 bg-white border border-[#dde1ec] rounded-[10px] p-[22px] h-full tabular-nums">
      <div className="flex items-center justify-between gap-2 pb-3 mb-1 border-b border-[#eceef4]">
        <h3 className="text-[13px] font-extrabold tracking-[-0.01em] text-[#0b1230]">
          Penjualan {period} hari terakhir
        </h3>
        
        {/* Segmented Control */}
        <div className="inline-flex rounded-lg bg-[#eef0f6] p-0.5">
          <button
            onClick={() => setPeriod("7")}
            className={`rounded-md px-[11px] py-[3px] text-[10.5px] font-bold transition-all ${
              period === "7"
                ? "bg-white text-[#0b1230] shadow-[0_1px_2px_rgba(11,18,48,0.12)]"
                : "text-[#656686] hover:text-[#0b1230]"
            }`}
          >
            7 hari
          </button>
          <button
            onClick={() => setPeriod("30")}
            className={`rounded-md px-[11px] py-[3px] text-[10.5px] font-bold transition-all ${
              period === "30"
                ? "bg-white text-[#0b1230] shadow-[0_1px_2px_rgba(11,18,48,0.12)]"
                : "text-[#656686] hover:text-[#0b1230]"
            }`}
          >
            30 hari
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex gap-2.5 mt-6">
        {/* Y Axis */}
        <div className="w-[44px] flex flex-col justify-between text-[10px] font-medium text-[#64748b] text-right pb-[22px]">
          <span>{max > 0 ? max.toLocaleString("id-ID") : "0"}</span>
          <span>{max > 0 ? (max / 2).toLocaleString("id-ID") : "0"}</span>
          <span>0</span>
        </div>

        {/* Bars Container */}
        <div className="relative flex-1">
          {/* Garis bantu (Horizontal) */}
          <div className="absolute inset-x-0 top-0 border-t border-dashed border-[#e6e9f2]" />
          <div className="absolute inset-x-0 top-[50%] border-t border-dashed border-[#e6e9f2]" />
          <div className="absolute inset-x-0 bottom-[22px] border-t border-[#e3e6ef]" />

          {/* Batang */}
          <div className="flex items-end h-[140px] gap-[11px] relative z-10 pb-[22px]">
            {displayData.map((d, i) => {
              const maxBarHeight = 118; 
              const heightPx = isEmpty ? (30 + Math.random() * 40) : (d.total / max) * maxBarHeight;
              
              return (
                <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                  
                  {/* Tooltip Hover */}
                  <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0b1230] text-white text-[10.5px] font-semibold px-[9px] py-[5px] rounded-md whitespace-nowrap z-20 pointer-events-none">
                    {d.isToday ? "Hari ini" : d.label}: Rp {d.total.toLocaleString("id-ID")}
                  </div>
                  
                  {/* Nilai hari ini di atas batang */}
                  {d.isToday && !isEmpty && d.total > 0 && (
                     <div className="text-[10.5px] font-extrabold text-[#c2410c] mb-1 absolute -top-5">
                        Rp {(d.total / 1000).toFixed(1).replace(".", ",")} rb
                     </div>
                  )}

                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(heightPx, 4)}px` }}
                    transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : i * 0.07, ease: [0.3, 0.8, 0.3, 1] }}
                    className={`w-full rounded-t-md ${
                      d.isToday && !isEmpty ? "bg-[#c2410c]" : "bg-[#e6e8f2]"
                    } group-hover:opacity-55 transition-opacity`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* X Axis Labels */}
      <div className="flex pl-[54px] mt-1">
        {displayData.map((d, i) => (
          <div key={i} className="flex-1 text-center text-[10px] text-[#8c87a0]">
            {d.isToday && !isEmpty ? (
              <span className="font-extrabold text-[#c2410c]">Hari ini</span>
            ) : (
              d.label
            )}
          </div>
        ))}
      </div>
      
            {/* Teks jika grafik kosong */}
      {isEmpty && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[11px] font-semibold text-[#9aa3b6] bg-white/80 px-3 py-1 rounded-full backdrop-blur-sm">
            Belum ada data penjualan
          </span>
        </div>
      )}
    </div>
  );
}