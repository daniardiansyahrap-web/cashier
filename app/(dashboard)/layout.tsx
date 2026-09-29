import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { LogoutButton } from "@/components/dashboard/logout-button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold">Cashier</h1>
          <p className="text-xs text-gray-500 mt-1">{session.user?.name}</p>
          <p className="text-xs text-gray-400">{(session.user as any).role}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link href="/dashboard" className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100">📊 Dashboard</Link>
          <Link href="/kasir" className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100">🛒 Kasir</Link>
          <Link href="/produk" className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100">📦 Produk</Link>
          <Link href="/stok" className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100">📥 Stok</Link>
          <Link href="/transaksi" className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100">🧾 Transaksi</Link>
          <Link href="/laporan" className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100">📈 Laporan</Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}