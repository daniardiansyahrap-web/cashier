import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/stok — Ambil stok semua produk per outlet
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

  const produk = await prisma.product.findMany({
    where: { tenantId, active: true },
    include: {
      stocks: {
        where: { outletId: outlet.id },
      },
    },
    orderBy: { nama: "asc" },
  });

  const result = produk.map((p) => ({
    id: p.id,
    nama: p.nama,
    sku: p.sku,
    satuan: p.satuan,
    stokMin: p.stokMin,
    stok: p.stocks[0]?.qty || 0,
  }));

  return NextResponse.json({ outlet: outlet.nama, produk: result });
}

// POST /api/stok — Stok masuk / keluar / opname
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenantId = (session.user as any).tenantId;
  const userId = (session.user as any).id;

  try {
    const body = await req.json();
    const { productId, tipe, qty, catatan } = body;

    if (!productId || !tipe || qty === undefined || qty === null) {
      return NextResponse.json(
        { error: "Produk, tipe, dan qty wajib diisi" },
        { status: 400 }
      );
    }

    if (!["in", "out", "opname"].includes(tipe)) {
      return NextResponse.json(
        { error: "Tipe stok tidak valid" },
        { status: 400 }
      );
    }

    const outlet = await prisma.outlet.findFirst({
      where: { tenantId },
    });

    if (!outlet) {
      return NextResponse.json(
        { error: "Outlet tidak ditemukan" },
        { status: 404 }
      );
    }

    const product = await prisma.product.findFirst({
      where: { id: productId, tenantId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    const existingStock = await prisma.stock.findUnique({
      where: {
        productId_outletId: {
          productId,
          outletId: outlet.id,
        },
      },
    });

    const stokAwal = existingStock?.qty || 0;
    let stokAkhir = stokAwal;
    let movementQty = 0;

    if (tipe === "in") {
      movementQty = parseInt(qty);
      stokAkhir = stokAwal + movementQty;
    } else if (tipe === "out") {
      movementQty = -parseInt(qty);
      stokAkhir = stokAwal + movementQty;
      if (stokAkhir < 0) {
        return NextResponse.json(
          { error: "Stok tidak cukup" },
          { status: 400 }
        );
      }
    } else if (tipe === "opname") {
      stokAkhir = parseInt(qty);
      movementQty = stokAkhir - stokAwal;
    }

    const result = await prisma.$transaction(async (tx) => {
      if (existingStock) {
        await tx.stock.update({
          where: { id: existingStock.id },
          data: { qty: stokAkhir },
        });
      } else {
        await tx.stock.create({
          data: {
            productId,
            outletId: outlet.id,
            qty: stokAkhir,
          },
        });
      }

      await tx.stockMovement.create({
        data: {
          productId,
          outletId: outlet.id,
          tipe,
          qty: movementQty,
          stokAwal,
          stokAkhir,
          catatan: catatan || null,
          userId,
        },
      });

      return { stokAwal, stokAkhir, movementQty };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Stok error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}