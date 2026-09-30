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

  const outlet = await prisma.outlet.findFirst({
    where: { tenantId },
  });

  if (!outlet) {
    return NextResponse.json({ error: "Outlet tidak ditemukan" }, { status: 404 });
  }

  const movements = await prisma.stockMovement.findMany({
    where: { outletId: outlet.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  // Ambil data produk untuk mapping nama
  const productIds = [...new Set(movements.map((m) => m.productId))];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, nama: true, sku: true, satuan: true },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  const result = movements.map((m) => ({
    ...m,
    produk: productMap.get(m.productId) || null,
  }));

  return NextResponse.json(result);
}