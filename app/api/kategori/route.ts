import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Ambil semua kategori
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tenantId = (session.user as any).tenantId;

  const kategori = await prisma.category.findMany({
    where: { tenantId },
    orderBy: { nama: "asc" },
  });

  return NextResponse.json(kategori);
}

// POST: Tambah kategori baru
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tenantId = (session.user as any).tenantId;

  try {
    const { nama } = await req.json();

    if (!nama) {
      return NextResponse.json({ error: "Nama kategori wajib diisi" }, { status: 400 });
    }

    const kategori = await prisma.category.create({
      data: { tenantId, nama },
    });

    return NextResponse.json(kategori, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menambah kategori" }, { status: 500 });
  }
}