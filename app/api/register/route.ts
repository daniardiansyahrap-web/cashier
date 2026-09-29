import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { nama, email, password, namaToko } = await req.json();

    if (!nama || !email || !password || !namaToko) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 14);

    const result = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: { nama: namaToko, plan: "trial", trialEnd },
      });

      await tx.outlet.create({
        data: { tenantId: tenant.id, nama: "Outlet Utama" },
      });

      const user = await tx.user.create({
        data: {
          tenantId: tenant.id,
          email,
          name: nama,
          password: hashedPassword,
          role: "owner",
        },
      });

      return { user };
    });

    return NextResponse.json(
      { message: "Registrasi berhasil", userId: result.user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}