import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OmzetCard } from "@/components/app/dashboard/OmzetCard";
import { AksiCepat } from "@/components/app/dashboard/AksiCepat";
import { ShortcutGrid } from "@/components/app/dashboard/ShortcutGrid";
import { SalesChart } from "@/components/app/dashboard/SalesChart";
import { TopProducts } from "@/components/app/dashboard/TopProducts";
import { RecentTransactions } from "@/components/app/dashboard/RecentTransactions";

async function getDashboardData(tenantId: string) {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

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

  const transaksiKemarin = await prisma.transaction.findMany({
    where: {
      tenantId,
      createdAt: { gte: startOfYesterday, lt: startOfToday },
      status: "paid",
    },
  });
  const omzetKemarin = transaksiKemarin.reduce((sum, t) => sum + t.total, 0);

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

  const startOf7Days = new Date(startOfToday);
  startOf7Days.setDate(startOf7Days.getDate() - 6);
  const transaksi7Hari = await prisma.transaction.findMany({
    where: { tenantId, createdAt: { gte: startOf7Days }, status: "paid" },
    select: { createdAt: true, total: true },
  });

  const hariLabels = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const penjualan7Hari: { label: string; total: number; isToday: boolean }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOf7Days);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    const total = transaksi7Hari
      .filter((t) => t.createdAt.toISOString().slice(0, 10) === dateStr)
      .reduce((sum, t) => sum + t.total, 0);
    penjualan7Hari.push({
      label: hariLabels[d.getDay()],
      total,
      isToday: i === 6,
    });
  }

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

  const transaksiTerbaru = await prisma.transaction.findMany({
    where: { tenantId, status: "paid" },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { items: true },
  });

  return {
    omzetHariIni,
    omzetKemarin,
    jumlahTransaksi,
    itemTerjual,
    stokRendah,
    penjualan7Hari,
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
  <div className="max-w-[1240px] mx-auto px-4 lg:px-7 py-4 lg:py-0">
      {/* MOBILE */}
      <div className="lg:hidden space-y-6 py-4">
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

      {/* DESKTOP */}
    <div className="hidden lg:grid grid-cols-12 gap-x-[17px] gap-y-5 -mt-[37px] relative z-10">
        <div className="col-span-7">
          <OmzetCard
            omzetHariIni={data.omzetHariIni}
            omzetKemarin={data.omzetKemarin}
            jumlahTransaksi={data.jumlahTransaksi}
            itemTerjual={data.itemTerjual}
            stokRendah={data.stokRendah}
          />
        </div>
        <div className="col-span-5">
          <AksiCepat />
        </div>

        <div className="col-span-7 h-[265px] min-h-0">
          <SalesChart data={data.penjualan7Hari} />
        </div>
        <div className="col-span-5 h-[265px] min-h-0">
          <TopProducts products={data.produkTerlaris} />
        </div>

        <div className="col-span-12">
          <RecentTransactions transactions={data.transaksiTerbaru} />
        </div>
      </div>
    </div>
  );
}