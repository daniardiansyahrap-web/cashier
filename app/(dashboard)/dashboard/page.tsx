import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OmzetCard } from "@/components/app/dashboard/OmzetCard";
import { ShortcutGrid } from "@/components/app/dashboard/ShortcutGrid";
import { SalesChart } from "@/components/app/dashboard/SalesChart";
import { TopProducts } from "@/components/app/dashboard/TopProducts";
import { RecentTransactions } from "@/components/app/dashboard/RecentTransactions";
import { OmzetCardDesktop } from "@/components/app/desktop/OmzetCardDesktop";
import { AksiCepatDesktop } from "@/components/app/desktop/AksiCepatDesktop";
import { SalesChartDesktop } from "@/components/app/desktop/SalesChartDesktop";
import { RecentTransactionsDesktop } from "@/components/app/desktop/RecentTransactionsDesktop";
import { TopProductsDesktop } from "@/components/app/desktop/TopProductsDesktop";
import { TodayNotesDesktop } from "@/components/app/desktop/TodayNotesDesktop";

async function getDashboardData(tenantId: string) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  // Transaksi hari ini
  const transaksiHariIni = await prisma.transaction.findMany({
    where: { tenantId, createdAt: { gte: startOfToday }, status: "paid" },
    include: { items: true },
  });

  const omzetHariIni = transaksiHariIni.reduce((sum, t) => sum + t.total, 0);
  const jumlahTransaksi = transaksiHariIni.length;
  const itemTerjual = transaksiHariIni.reduce(
    (sum, t) => sum + t.items.reduce((s, i) => s + i.qty, 0),
    0
  );

  // Transaksi kemarin
  const transaksiKemarin = await prisma.transaction.findMany({
    where: {
      tenantId,
      createdAt: { gte: startOfYesterday, lt: startOfToday },
      status: "paid",
    },
  });
  const omzetKemarin = transaksiKemarin.reduce((sum, t) => sum + t.total, 0);

  // Stok rendah
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

  // Transaksi 30 Hari Terakhir (untuk Grafik)
  const startOf30Days = new Date(startOfToday);
  startOf30Days.setDate(startOf30Days.getDate() - 29);

  const transaksi30Hari = await prisma.transaction.findMany({
    where: { tenantId, createdAt: { gte: startOf30Days }, status: "paid" },
    select: { createdAt: true, total: true },
  });

  const hariLabels = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const generateChartData = (days: number) => {
    const start = new Date(startOfToday);
    start.setDate(start.getDate() - (days - 1));
    const arr = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      const total = transaksi30Hari
        .filter((t) => t.createdAt.toISOString().slice(0, 10) === dateStr)
        .reduce((sum, t) => sum + t.total, 0);

      arr.push({
        label: hariLabels[d.getDay()],
        total,
        isToday: i === days - 1,
      });
    }
    return arr;
  };

  const penjualan7Hari = generateChartData(7);
  const penjualan30Hari = generateChartData(30);

  // Produk terlaris bulan ini
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
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

  const produkMap = new Map<string, { nama: string; qty: number; total: number }>();
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
  const produkTerlaris = Array.from(produkMap.values())
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  // Transaksi terbaru
  const transaksiTerbaru = await prisma.transaction.findMany({
    where: { tenantId, status: "paid" },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { items: true },
  });

  return {
    omzetHariIni,
    omzetKemarin,
    jumlahTransaksi,
    itemTerjual,
    stokRendah,
    penjualan7Hari,
    penjualan30Hari,
    produkTerlaris,
    transaksiTerbaru,
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const tenantId = (session.user as any).tenantId;
  const data = await getDashboardData(tenantId);

  return (
    <>
      {/* === MOBILE VIEW (Jangan Diubah) === */}
      <div className="lg:hidden space-y-4 py-4">
        <OmzetCard
          omzetHariIni={data.omzetHariIni}
          omzetKemarin={data.omzetKemarin}
          jumlahTransaksi={data.jumlahTransaksi}
          itemTerjual={data.itemTerjual}
          stokRendah={data.stokRendah}
        />
        <ShortcutGrid />
        <SalesChart data={data.penjualan7Hari} />
        <TopProducts products={data.produkTerlaris} />
        <RecentTransactions transactions={data.transaksiTerbaru} />
      </div>

      {/* === DESKTOP VIEW === */}
      <div className="hidden lg:grid grid-cols-12 gap-x-[17px] gap-y-[8px] pb-0">

        {/* Baris 1: Omzet (8 col) + Aksi Cepat (4 col) */}
        <div className="col-span-8">
          <OmzetCardDesktop data={data} />
        </div>
        <div className="col-span-4">
          <AksiCepatDesktop />
        </div>

        {/* Baris 2: Grafik (8 col) + Catatan (4 col) */}
        <div className="col-span-8">
          <SalesChartDesktop
            data7Hari={data.penjualan7Hari}
            data30Hari={data.penjualan30Hari}
          />
        </div>
        <div className="col-span-4">
          <TodayNotesDesktop />
        </div>

        {/* Baris 3: Transaksi (8 col) + Produk Terlaris (4 col) */}
        <div className="col-span-8">
          <RecentTransactionsDesktop transactions={data.transaksiTerbaru} />
        </div>
        <div className="col-span-4">
          <TopProductsDesktop products={data.produkTerlaris} />
        </div>

      </div>
    </>
  );
}