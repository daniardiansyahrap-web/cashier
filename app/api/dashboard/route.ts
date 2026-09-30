import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenantId = (session.user as any).tenantId;

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  // 7 hari terakhir
  const startOf7DaysAgo = new Date(startOfToday);
  startOf7DaysAgo.setDate(startOf7DaysAgo.getDate() - 6);

  // Awal bulan ini
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // 1. Transaksi hari ini
  const transaksiHariIni = await prisma.transaction.findMany({
    where: {
      tenantId,
      createdAt: { gte: startOfToday },
      status: "paid",
    },
    include: { items: true },
  });

  const omzetHariIni = transaksiHariIni.reduce((sum, t) => sum + t.total, 0);
  const jumlahTransaksiHariIni = transaksiHariIni.length;
  const itemTerjualHariIni = transaksiHariIni.reduce(
    (sum, t) => sum + t.items.reduce((s, i) => s + i.qty, 0),
    0
  );

  // 2. Stok rendah
  const outlet = await prisma.outlet.findFirst({
    where: { tenantId },
  });

  let stokRendah = 0;
  if (outlet) {
    const produkDenganStok = await prisma.product.findMany({
      where: { tenantId, active: true },
      include: {
        stocks: { where: { outletId: outlet.id } },
      },
    });

    stokRendah = produkDenganStok.filter(
      (p) => (p.stocks[0]?.qty || 0) <= p.stokMin
    ).length;
  }

  // 3. Penjualan 7 hari terakhir
  const transaksi7Hari = await prisma.transaction.findMany({
    where: {
      tenantId,
      createdAt: { gte: startOf7DaysAgo },
      status: "paid",
    },
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

    penjualan7Hari.push({
      tanggal: dateStr,
      total,
    });
  }

  // 4. Produk terlaris bulan ini
  const itemsBulanIni = await prisma.transactionItem.findMany({
    where: {
      transaction: {
        tenantId,
        createdAt: { gte: startOfMonth },
        status: "paid",
      },
    },
    select: {
      productId: true,
      namaProduk: true,
      qty: true,
      subtotal: true,
    },
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

  // 5. Transaksi terbaru
  const transaksiTerbaru = await prisma.transaction.findMany({
    where: { tenantId, status: "paid" },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { items: true },
  });

  return NextResponse.json({
    omzetHariIni,
    jumlahTransaksiHariIni,
    itemTerjualHariIni,
    stokRendah,
    penjualan7Hari,
    produkTerlaris,
    transaksiTerbaru,
  });
}