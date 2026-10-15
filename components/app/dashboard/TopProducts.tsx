import { rupiah } from "@/lib/format";

type Product = { nama: string; qty: number; total: number };

export function TopProducts({ products }: { products: Product[] }) {
  const isEmpty = products.length === 0;

  return (
    <div className="bg-white rounded-[22px] lg:rounded-lg p-5 lg:p-3 border border-cx-line h-full min-h-0 flex flex-col overflow-hidden">
      <h3 className="text-[15px] font-extrabold text-cx-navy mb-5 lg:mb-1">
        Produk terlaris
      </h3>

      {isEmpty ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="shrink-0 size-7 rounded-lg grid place-items-center text-[12px] font-extrabold bg-[#fff0e3] text-cx-orange-d">
                {i}
              </span>
              <div className="flex-1 space-y-1.5">
                <div className="h-2.5 bg-cx-bg rounded-full w-3/4" />
                <div className="h-2 bg-cx-bg rounded-full w-1/2" />
              </div>
            </div>
          ))}
          <p className="text-[11px] text-cx-muted text-center mt-5 italic">
            Belum ada produk terjual hari ini.
          </p>
        </div>
      ) : (
        <div className="space-y-4 lg:space-y-2 flex-1">
          {products.map((p, i) => (
            <div key={i} className="flex items-center gap-3">
              <span
                className={`shrink-0 size-7 lg:size-6 rounded-lg grid place-items-center text-[12px] font-extrabold ${
                  i === 0
                    ? "bg-[#fff0e3] text-cx-orange-d"
                    : "bg-[#e8eefc] text-cx-blue"
                }`}
              >
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] lg:text-[13px] lg:leading-tight font-semibold text-cx-navy truncate">
                  {p.nama}
                </div>
                <div className="text-[11px] lg:text-[11px] lg:leading-tight text-cx-muted">
                  {p.qty} terjual
                </div>
              </div>
              <div className="text-[12px] lg:text-[12px] font-bold text-cx-blue tabular-nums">
                {rupiah(p.total)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}