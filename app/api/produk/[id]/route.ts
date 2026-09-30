import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenantId = (session.user as any).tenantId;
  const { id } = await params;

  try {
    const body = await req.json();
    const { nama, sku, barcode, hargaJual, hargaBeli, satuan, stokMin } = body;

    if (!nama || !hargaJual) {
      return NextResponse.json(
        { error: "Nama dan harga jual wajib diisi" },
        { status: 400 }
      );
    }

    const existing = await prisma.product.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        nama,
        sku: sku || null,
        barcode: barcode || null,
        hargaJual: parseInt(hargaJual),
        hargaBeli: hargaBeli ? parseInt(hargaBeli) : null,
        satuan: satuan || "pcs",
        stokMin: stokMin ? parseInt(stokMin) : 0,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update produk error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenantId = (session.user as any).tenantId;
  const { id } = await params;

  try {
    const existing = await prisma.product.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.product.update({
      where: { id },
      data: { active: false },
    });

    return NextResponse.json({ message: "Produk dihapus" });
  } catch (error) {
    console.error("Delete produk error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}