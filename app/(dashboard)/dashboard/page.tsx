import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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

async function getDashboardData(tenantId: string) {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const startOf7DaysAgo = new Date(startOfToday);
  startOf7DaysAgo.setDate(startOf7DaysAgo.getDate() - 6);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const transaksiHariIni = await prisma.transaction.findMany({
    where: { tenantId, createdAt: { gte: startOfToday }, status: "paid" },
    include: { items: true },
  });

  const omzetHariIni = transaksiHariIni.reduce((sum, t) => sum + t.total, 0);
  const jumlahTransaksiHariIni = transaksiHariIni.length;
  const itemTerjualHariIni = transaksiHariIni.reduce(
    (sum, t) => sum + t.items.reduce((s, i) => s + i.qty, 0),
    0
  );

  const outlet = await prisma.outlet.findFirst({ where: { tenantId } });
  let stokRendah = 0;
  if (outlet) {
    const produkDenganStok = await prisma.product.findMany({
      where: { tenantId, active: true },
      include: { stocks: { where: { outletId: outlet.id } } },
    });
    stokRendah = produkDenganStok.filter(
      (p) => (p.stocks[0]?.qty || 0) <= p.stokMin
    ).length;
  }

  const transaksi7Hari = await prisma.transaction.findMany({
    where: { tenantId, createdAt: { gte: startOf7DaysAgo }, status: "paid" },
    select: { createdAt: true, total: true },
  });

  const penjualan7Hari: { tanggal: string; total: number }[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOf7DaysAgo);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().slice(0, 10);
    const total = transaksi7Hari
      .filter((t) => t.createdAt.toISOString().slice(0, 10) === dateStr)
      .reduce((sum, t) => sum + t.total, 0);
    penjualan7Hari.push({ tanggal: dateStr, total });
  }

  const itemsBulanIni = await prisma.transactionItem.findMany({
    where: {
      transaction: {
        tenantId,
        createdAt: { gte: startOfMonth },
        status: "paid",
      },
    },
    select: { productId: true, namaProduk: true, qty: true, subtotal: true },
  });

  const produkMap = new Map<
    string,
    { nama: string; qty: number; total: number }
  >();
  for (const item of itemsBulanIni) {
    const existing = produkMap.get(item.productId);
    if (existing) {
      existing.qty += item.qty;
      existing.total += item.subtotal;
    } else {
      produkMap.set(item.productId, {
        nama: item.namaProduk,
        qty: item.qty,
        total: item.subtotal,
      });
    }
  }

  const produkTerlaris = Array.from(produkMap.entries())
    .map(([id, data]) => ({ productId: id, ...data }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 10);

  const transaksiTerbaru = await prisma.transaction.findMany({
    where: { tenantId, status: "paid" },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { items: true },
  });

  return {
    omzetHariIni,
    jumlahTransaksiHariIni,
    itemTerjualHariIni,
    stokRendah,
    penjualan7Hari,
    produkTerlaris,
    transaksiTerbaru,
  };
}

function formatRupiah(angka: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
}

function formatSingkat(angka: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
}

function formatTanggal(iso: Date | string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function hariSingkat(dateStr: string) {
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat("id-ID", { weekday: "short" }).format(d);
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const tenantId = (session.user as any).tenantId;
  const data = await getDashboardData(tenantId);

  const maxPenjualan = Math.max(...data.penjualan7Hari.map((p) => p.total), 1);

  return (
    <div className="p-4 md:p-6">
      <div className="mb-3">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 text-xs md:text-sm mt-0.5">
          Selamat datang, {session.user?.name}!
        </p>
      </div>

      {/* Kartu Statistik — 1 baris */}
      <div className="bg-white border rounded-lg py-3 px-2 mb-3 flex items-stretch">
        <div className="flex-1 text-center px-1">
          <div className="text-[10px] md:text-xs text-gray-500 mb-0.5">
            Omzet Hari Ini
          </div>
          <div className="text-sm md:text-base font-bold text-blue-600 truncate">
            {formatSingkat(data.omzetHariIni)}
          </div>
        </div>
        <div className="w-px bg-gray-200" />
        <div className="flex-1 text-center px-1">
          <div className="text-[10px] md:text-xs text-gray-500 mb-0.5">
            Transaksi
          </div>
          <div className="text-sm md:text-base font-bold">
            {data.jumlahTransaksiHariIni}
          </div>
        </div>
        <div className="w-px bg-gray-200" />
        <div className="flex-1 text-center px-1">
          <div className="text-[10px] md:text-xs text-gray-500 mb-0.5">
            Item Terjual
          </div>
          <div className="text-sm md:text-base font-bold">
            {data.itemTerjualHariIni}
          </div>
        </div>
        <div className="w-px bg-gray-200" />
        <div className="flex-1 text-center px-1">
          <div className="text-[10px] md:text-xs text-gray-500 mb-0.5">
            Stok Rendah
          </div>
          <div
            className={`text-sm md:text-base font-bold ${
              data.stokRendah > 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            {data.stokRendah}
          </div>
        </div>
      </div>

      {/* Grafik 7 Hari */}
      <Card className="mb-3">
        <CardHeader className="p-3 md:p-4 pb-2">
          <CardTitle className="text-sm md:text-base">
            Penjualan 7 Hari Terakhir
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-4 pt-0">
          <div className="flex items-end justify-between gap-1 md:gap-2 h-24 md:h-32">
            {data.penjualan7Hari.map((p) => {
              const height = (p.total / maxPenjualan) * 100;
              return (
                <div
                  key={p.tanggal}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div className="text-[9px] md:text-xs font-medium text-gray-600 h-3 md:h-4 truncate w-full text-center">
                    {p.total > 0 ? formatSingkat(p.total) : ""}
                  </div>
                  <div className="w-full flex items-end h-16 md:h-24">
                    <div
                      className="w-full bg-blue-500 rounded-t transition-all"
                      style={{ height: `${Math.max(height, 2)}%` }}
                    />
                  </div>
                  <div className="text-[10px] md:text-xs text-gray-500">
                    {hariSingkat(p.tanggal)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Card Bawah — tinggi seimbang */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch">
        {/* Produk Terlaris */}
        <div className="w-full lg:flex-1">
          <Card className="h-full">
            <CardHeader className="px-3 md:px-4 py-2 md:py-3">
              <CardTitle className="text-sm md:text-base">
                Produk Terlaris Bulan Ini
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 md:px-4 pt-0 pb-2">
              {data.produkTerlaris.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm">
                  Belum ada penjualan bulan ini
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Produk</TableHead>
                      <TableHead className="text-right text-xs">
                        Terjual
                      </TableHead>
                      <TableHead className="text-right text-xs">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.produkTerlaris.map((p) => (
                      <TableRow key={p.productId}>
                        <TableCell className="font-medium text-xs md:text-sm py-2">
                          {p.nama}
                        </TableCell>
                        <TableCell className="text-right font-bold text-xs md:text-sm py-2">
                          {p.qty}
                        </TableCell>
                        <TableCell className="text-right text-xs md:text-sm py-2">
                          {formatRupiah(p.total)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Transaksi Terbaru */}
        <div className="w-full lg:flex-1">
          <Card className="h-full flex flex-col">
            <CardHeader className="px-3 md:px-4 py-2 md:py-3">
              <CardTitle className="text-sm md:text-base">
                Transaksi Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 md:px-4 pt-0 pb-2 flex-1 overflow-hidden">
              {data.transaksiTerbaru.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 py-6">
                  <div className="text-3xl mb-2">🧾</div>
                  <div className="text-xs md:text-sm">Belum ada transaksi</div>
                </div>
              ) : (
                <div className="space-y-0.5 max-h-72 md:max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                  {data.transaksiTerbaru.map((t) => (
                    <div
                      key={t.id}
                      className="flex justify-between items-center border-b pb-1.5 last:border-0 gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-mono text-[10px] md:text-xs text-gray-600 truncate">
                          {t.nomor}
                        </div>
                        <div className="text-[10px] md:text-xs text-gray-500">
                          {formatTanggal(t.createdAt)} ·{" "}
                          {t.items.reduce((s, i) => s + i.qty, 0)} item
                        </div>
                      </div>
                      <div className="font-bold text-xs md:text-sm whitespace-nowrap">
                        {formatRupiah(t.total)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}