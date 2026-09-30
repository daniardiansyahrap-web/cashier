import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/transaksi — Ambil riwayat transaksi
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenantId = (session.user as any).tenantId;

  const transaksi = await prisma.transaction.findMany({
    where: { tenantId },
    include: {
      items: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(transaksi);
}

// POST /api/transaksi — Simpan transaksi baru
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenantId = (session.user as any).tenantId;
  const kasirId = (session.user as any).id;

  try {
    const body = await req.json();
    const { items, metodeBayar, bayar, diskon = 0, catatan } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Keranjang kosong" },
        { status: 400 }
      );
    }

    if (!metodeBayar || !bayar) {
      return NextResponse.json(
        { error: "Metode bayar dan nominal wajib diisi" },
        { status: 400 }
      );
    }

    const outlet = await prisma.outlet.findFirst({
      where: { tenantId },
    });

    if (!outlet) {
      return NextResponse.json(
        { error: "Outlet tidak ditemukan" },
        { status: 400 }
      );
    }

    let subtotal = 0;
    for (const item of items) {
      subtotal += item.harga * item.qty - (item.diskon || 0);
    }
    const total = subtotal - diskon;
    const kembalian = bayar - total;

    if (kembalian < 0) {
      return NextResponse.json(
        { error: "Nominal bayar kurang dari total" },
        { status: 400 }
      );
    }

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const countToday = await prisma.transaction.count({
      where: {
        tenantId,
        createdAt: {
          gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        },
      },
    });
    const nomor = `TRX-${dateStr}-${String(countToday + 1).padStart(4, "0")}`;

    const result = await prisma.$transaction(async (tx) => {
      const trx = await tx.transaction.create({
        data: {
          tenantId,
          outletId: outlet.id,
          kasirId,
          nomor,
          subtotal,
          diskon,
          total,
          metodeBayar,
          bayar,
          kembalian,
          status: "paid",
          catatan: catatan || null,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              namaProduk: item.namaProduk,
              qty: item.qty,
              harga: item.harga,
              diskon: item.diskon || 0,
              subtotal: item.harga * item.qty - (item.diskon || 0),
            })),
          },
        },
        include: { items: true },
      });

      for (const item of items) {
        const existingStock = await tx.stock.findUnique({
          where: {
            productId_outletId: {
              productId: item.productId,
              outletId: outlet.id,
            },
          },
        });

        const stokAwal = existingStock?.qty || 0;
        const stokAkhir = stokAwal - item.qty;

        if (existingStock) {
          await tx.stock.update({
            where: { id: existingStock.id },
            data: { qty: stokAkhir },
          });
        } else {
          await tx.stock.create({
            data: {
              productId: item.productId,
              outletId: outlet.id,
              qty: stokAkhir,
            },
          });
        }

        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            outletId: outlet.id,
            tipe: "sale",
            qty: -item.qty,
            stokAwal,
            stokAkhir,
            referensi: trx.id,
            userId: kasirId,
          },
        });
      }

      return trx;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Transaksi error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}