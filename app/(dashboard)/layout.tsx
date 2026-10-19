import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app/AppShell";
import { DashboardHero } from "@/components/app/dashboard/DashboardHero"; // Mobile header

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const tenantId = (session.user as any).tenantId;
  
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  const outlet = await prisma.outlet.findFirst({ where: { tenantId }, select: { nama: true } });

  // Hitung trial
  let trialDaysLeft = 0;
  if (tenant?.plan === "trial" && tenant.trialEnd) {
    const diff = new Date(tenant.trialEnd).getTime() - new Date().getTime();
    trialDaysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  // Data dummy untuk header popover (nanti dihubungkan ke data asli)
  const notifications = [
    { type: "warning" as const, title: "5 barang hampir habis", desc: "pop ice (0), masako (2), milo (3), dan 2 lainnya" },
    { type: "info" as const, title: "Rekap kemarin sudah siap", desc: "Omzet Rp 3,05 juta dari 79 transaksi" },
  ];

  return (
    <AppShell
      userName={session.user?.name || ""}
      userRole={(session.user as any).role || "kasir"}
      outletName={outlet?.nama || "Outlet Utama"}
      trialDaysLeft={trialDaysLeft}
      notifications={notifications}
      header={<DashboardHero userName={session.user?.name || ""} outletName={outlet?.nama || "Outlet Utama"} lowStockCount={5} />}
    >
      {children}
    </AppShell>
  );
}