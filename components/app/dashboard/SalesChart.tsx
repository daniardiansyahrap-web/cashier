"use client";

import { motion, useReducedMotion } from "framer-motion";

type Day = { label: string; total: number; isToday: boolean };

export function SalesChart({ data }: { data: Day[] }) {
  const reduce = useReducedMotion();
  const max = Math.max(...data.map((d) => d.total), 1);
  const isEmpty = data.every((d) => d.total === 0);

  return (
    <div className="bg-white rounded-[22px] lg:rounded-lg p-5 lg:p-4 border border-cx-line h-full min-h-0 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-6 lg:mb-3">
        <h3 className="text-[15px] font-extrabold text-cx-navy">
          Penjualan 7 hari terakhir
        </h3>
        <span className="text-[11px] text-cx-muted font-semibold bg-cx-bg px-2.5 py-1 rounded-md">
          Minggu ini
        </span>
      </div>

      <div className="flex items-stretch gap-2.5 h-32 lg:h-[141px] mt-auto">
        {data.map((d, i) => {
          const height = isEmpty ? 30 + Math.random() * 40 : (d.total / max) * 100;
          return (
            <div key={i} className="flex-1 min-w-0 h-full flex flex-col items-center gap-2">
              <div className="flex-1 min-h-0 w-full flex items-end">
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: `${Math.max(height, 8)}%` }}
                  viewport={{ once: true }}
                  transition={{
                    duration: reduce ? 0 : 0.5,
                    delay: reduce ? 0 : i * 0.08,
                    ease: "easeOut",
                  }}
                  className={`w-full rounded-t-md ${
                    d.isToday && !isEmpty
                      ? "bg-cx-orange"
                      : "bg-[#dbe5fb]"
                  }`}
                  style={{ minHeight: "8px" }}
                />
              </div>
              <span
                className={`text-[10px] font-semibold ${
                  d.isToday && !isEmpty
                    ? "text-cx-orange-d"
                    : "text-cx-muted"
                }`}
              >
                {d.isToday && !isEmpty ? "Hari ini" : d.label}
              </span>
            </div>
          );
        })}
      </div>

      {isEmpty && (
        <p className="text-[11px] text-cx-muted text-center mt-5 italic">
          Kerangka grafik. Batang terisi setelah ada transaksi.
        </p>
      )}
    </div>
  );
}