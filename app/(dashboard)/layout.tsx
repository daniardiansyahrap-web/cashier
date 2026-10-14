import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app/AppShell";

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

  return (
    <AppShell
      userName={session.user?.name || ""}
      userRole={(session.user as any).role || "kasir"}
      outletName={outlet?.nama || "Outlet Utama"}
    >
      {children}
    </AppShell>
  );
}