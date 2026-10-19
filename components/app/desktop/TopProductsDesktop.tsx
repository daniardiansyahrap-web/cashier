"use client";

import { rupiah } from "@/lib/format";

type Product = { nama: string; qty: number; total: number };

export function TopProductsDesktop({ products }: { products: Product[] }) {
  const isEmpty = products.length === 0;
  
  // Batasi maksimal 4 produk buat desktop
  const displayProducts = products.slice(0, 4);
  const maxQty = displayProducts.length > 0 ? displayProducts[0].qty : 1;

  return (
    <div className="flex flex-col min-w-0 bg-white border border-[#dde1ec] rounded-[10px] p-[22px] h-full tabular-nums">
      <div className="flex items-center justify-between pb-3 mb-1 border-b border-[#eceef4]">
        <h3 className="text-[13px] font-extrabold tracking-[-0.01em] text-[#0b1230]">
          Produk terlaris
        </h3>
        <span className="rounded-full bg-[#eef0f6] px-2.5 py-0.5 text-[10px] font-bold text-[#656686]">
          Bulan ini
        </span>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-10 mt-2 border-t border-dashed border-[#d6dbe8]">
          <div className="text-[12.5px] font-bold text-[#0b1230]">
            Belum ada barang terjual
          </div>
          <div className="text-[11.5px] text-[#757895] mt-1">
            Peringkat tersusun sendiri setelah ada penjualan.
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-0.5 mt-1">
          {displayProducts.map((p, i) => (
            <div
              key={i}
              className="flex flex-wrap items-center gap-2.5 py-[9px] border-b border-[#f6f7fb] last:border-0"
            >
              <span
                className={`grid place-items-center size-[22px] rounded-md text-[10px] font-extrabold shrink-0 ${
                  i === 0
                    ? "bg-[#fff0e6] text-[#c2410c]"
                    : "bg-[#f1f2f8] text-[#5f6485]"
                }`}
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[12.5px] font-bold text-[#0b1230] truncate">
                  {p.nama}
                </div>
                <div className="text-[10px] text-[#757895]">{p.qty} terjual</div>
              </div>
              <div className="text-[11.5px] font-extrabold text-[#0b1230] ml-auto">
                {rupiah(p.total)}
              </div>

              {/* Bar Proporsi */}
              <div className="basis-full h-[3px] rounded-full bg-[#eef0f6] ml-8 mt-0.5">
                <div
                  className={`h-full rounded-full ${
                    i === 0 ? "bg-[#c2410c]" : "bg-[#1d4ed8] opacity-75"
                  }`}
                  style={{ width: `${Math.max((p.qty / maxQty) * 100, 2)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}