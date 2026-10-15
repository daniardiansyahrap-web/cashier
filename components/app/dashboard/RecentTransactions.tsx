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

export function RecentTransactions({ transactions }: { transactions: Trx[] }) {
  const isEmpty = transactions.length === 0;

  return (
    <div className="bg-white rounded-[22px] lg:rounded-lg p-4 border border-cx-line max-h-[336px] min-h-0 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-2 shrink-0">
        <h3 className="text-[15px] font-extrabold text-cx-navy">
          Transaksi terbaru
        </h3>
        {!isEmpty && (
          <a
            href="/transaksi"
            className="text-[12px] font-semibold text-cx-orange-d hover:underline"
          >
            Lihat semua
          </a>
        )}
      </div>

      {isEmpty ? (
        <div className="py-8 text-center">
          <p className="text-[12px] text-cx-muted italic">
            Belum ada transaksi hari ini.
          </p>
        </div>
      ) : (
        <div className="max-h-[252px] overflow-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-cx-line">
                <th className="text-[11px] font-semibold text-cx-muted uppercase tracking-wider py-1.5 pr-3">
                  No. struk
                </th>
                <th className="text-[11px] font-semibold text-cx-muted uppercase tracking-wider py-1.5 pr-3">
                  Waktu
                </th>
                <th className="text-[11px] font-semibold text-cx-muted uppercase tracking-wider py-1.5 pr-3">
                  Item
                </th>
                <th className="text-[11px] font-semibold text-cx-muted uppercase tracking-wider py-1.5 pr-3">
                  Total
                </th>
                <th className="text-[11px] font-semibold text-cx-muted uppercase tracking-wider py-1.5">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-cx-line/50 last:border-0"
                >
                  <td className="py-1.5 pr-3 text-[12px] font-mono text-cx-navy">
                    {t.nomor}
                  </td>
                  <td className="py-1.5 pr-3 text-[12px] text-cx-muted">
                    {formatTanggal(t.createdAt)}
                  </td>
                  <td className="py-1.5 pr-3 text-[12px] text-cx-muted">
                    {t.items.reduce((s, i) => s + i.qty, 0)} item
                  </td>
                  <td className="py-1.5 pr-3 text-[12px] font-bold text-cx-navy tabular-nums">
                    {rupiah(t.total)}
                  </td>
                  <td className="py-1.5 text-[12px]">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#e6f6ec] text-cx-ok">
                      {metodeLabel(t.metodeBayar)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}