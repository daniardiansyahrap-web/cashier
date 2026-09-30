import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenantId = (session.user as any).tenantId;

  const { searchParams } = new URL(req.url);
  const periode = searchParams.get("periode") || "hari-ini";

  const now = new Date();
  let startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (periode === "7-hari") {
    startDate.setDate(startDate.getDate() - 6);
  } else if (periode === "30-hari") {
    startDate.setDate(startDate.getDate() - 29);
  } else if (periode === "bulan-ini") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  const transaksi = await prisma.transaction.findMany({
    where: {
      tenantId,
      createdAt: { gte: startDate },
      status: "paid",
    },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const totalOmzet = transaksi.reduce((sum, t) => sum + t.total, 0);
  const totalTransaksi = transaksi.length;
  const totalItem = transaksi.reduce(
    (sum, t) => sum + t.items.reduce((s, i) => s + i.qty, 0),
    0
  );
  const rataRata = totalTransaksi > 0 ? totalOmzet / totalTransaksi : 0;

  // Per metode bayar
  const metodeMap = new Map<string, { jumlah: number; total: number }>();
  for (const t of transaksi) {
    const existing = metodeMap.get(t.metodeBayar);
    if (existing) {
      existing.jumlah += 1;
      existing.total += t.total;
    } else {
      metodeMap.set(t.metodeBayar, { jumlah: 1, total: t.total });
    }
  }
  const perMetode = Array.from(metodeMap.entries()).map(([metode, data]) => ({
    metode,
    ...data,
  }));

  // Produk terlaris
  const produkMap = new Map<
    string,
    { nama: string; qty: number; total: number }
  >();
  for (const t of transaksi) {
    for (const item of t.items) {
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
  }
  const produkTerlaris = Array.from(produkMap.entries())
    .map(([id, data]) => ({ productId: id, ...data }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 10);

  return NextResponse.json({
    periode,
    startDate: startDate.toISOString(),
    endDate: now.toISOString(),
    ringkasan: {
      totalOmzet,
      totalTransaksi,
      totalItem,
      rataRata,
    },
    perMetode,
    produkTerlaris,
    transaksi,
  });
}