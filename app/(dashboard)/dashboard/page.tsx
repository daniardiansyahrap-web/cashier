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
    .slice(0, 5);

  const transaksiTerbaru = await prisma.transaction.findMany({
    where: { tenantId, status: "paid" },
    orderBy: { createdAt: "desc" },
    take: 5,
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
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Selamat datang, {session.user?.name}!
        </p>
      </div>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-normal">
              Omzet Hari Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatRupiah(data.omzetHariIni)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-normal">
              Transaksi Hari Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.jumlahTransaksiHariIni}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-normal">
              Item Terjual Hari Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.itemTerjualHariIni}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-normal">
              Stok Rendah
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                data.stokRendah > 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {data.stokRendah} produk
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grafik 7 Hari */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Penjualan 7 Hari Terakhir</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-2 h-48">
            {data.penjualan7Hari.map((p) => {
              const height = (p.total / maxPenjualan) * 100;
              return (
                <div
                  key={p.tanggal}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="text-xs font-medium text-gray-600">
                    {p.total > 0 ? formatRupiah(p.total) : ""}
                  </div>
                  <div className="w-full flex items-end h-32">
                    <div
                      className="w-full bg-blue-500 rounded-t transition-all"
                      style={{ height: `${Math.max(height, 2)}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    {hariSingkat(p.tanggal)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Produk Terlaris */}
        <Card>
          <CardHeader>
            <CardTitle>Produk Terlaris Bulan Ini</CardTitle>
          </CardHeader>
          <CardContent>
            {data.produkTerlaris.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                Belum ada penjualan bulan ini
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produk</TableHead>
                    <TableHead className="text-right">Terjual</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.produkTerlaris.map((p) => (
                    <TableRow key={p.productId}>
                      <TableCell className="font-medium text-sm">
                        {p.nama}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {p.qty}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {formatRupiah(p.total)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Transaksi Terbaru */}
        <Card>
          <CardHeader>
            <CardTitle>Transaksi Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            {data.transaksiTerbaru.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                Belum ada transaksi
              </div>
            ) : (
              <div className="space-y-3">
                {data.transaksiTerbaru.map((t) => (
                  <div
                    key={t.id}
                    className="flex justify-between items-center border-b pb-2 last:border-0"
                  >
                    <div>
                      <div className="font-mono text-xs text-gray-600">
                        {t.nomor}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTanggal(t.createdAt)} ·{" "}
                        {t.items.reduce((s, i) => s + i.qty, 0)} item
                      </div>
                    </div>
                    <div className="font-bold text-sm">
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
  );
}