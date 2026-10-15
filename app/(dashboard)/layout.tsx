import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app/AppShell";
import { DashboardHero } from "@/components/app/dashboard/DashboardHero";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const tenantId = (session.user as any).tenantId;

  const outlet = await prisma.outlet.findFirst({
    where: { tenantId },
    select: { nama: true },
  });

  // Hitung stok rendah untuk header
  let lowStockCount = 0;
  if (outlet) {
    const outletFull = await prisma.outlet.findFirst({
      where: { tenantId },
      select: { id: true },
    });
    if (outletFull) {
      const produkDenganStok = await prisma.product.findMany({
        where: { tenantId, active: true },
        include: { stocks: { where: { outletId: outletFull.id } } },
      });
      lowStockCount = produkDenganStok.filter(
        (p) => (p.stocks[0]?.qty || 0) <= p.stokMin
      ).length;
    }
  }

  return (
    <AppShell
      userName={session.user?.name || ""}
      userRole={(session.user as any).role || "kasir"}
      outletName={outlet?.nama || "Outlet Utama"}
      header={
        <DashboardHero
          userName={session.user?.name || ""}
          outletName={outlet?.nama || "Outlet Utama"}
          lowStockCount={lowStockCount}
        />
      }
    >
      {children}
    </AppShell>
  );
}