import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/produk — Ambil semua produk milik tenant user
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenantId = (session.user as any).tenantId;

  const produk = await prisma.product.findMany({
    where: { tenantId, active: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(produk);
}

// POST /api/produk — Tambah produk baru
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenantId = (session.user as any).tenantId;

  try {
    const body = await req.json();
    const { nama, sku, barcode, hargaJual, hargaBeli, satuan, stokMin } = body;

    if (!nama || !hargaJual) {
      return NextResponse.json(
        { error: "Nama dan harga jual wajib diisi" },
        { status: 400 }
      );
    }

    const produk = await prisma.product.create({
      data: {
        tenantId,
        nama,
        sku: sku || null,
        barcode: barcode || null,
        hargaJual: parseInt(hargaJual),
        hargaBeli: hargaBeli ? parseInt(hargaBeli) : null,
        satuan: satuan || "pcs",
        stokMin: stokMin ? parseInt(stokMin) : 0,
      },
    });

    return NextResponse.json(produk, { status: 201 });
  } catch (error: any) {
    console.error("Produk error:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "SKU sudah dipakai. Pakai SKU lain." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
} 