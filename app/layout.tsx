import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Cashier — Aplikasi Kasir Modern untuk UMKM Indonesia",
  description:
    "Kelola toko lebih mudah: POS cepat, stok akurat, laporan lengkap. Coba gratis 14 hari tanpa kartu kredit.",
  icons: {
    icon: "/logo-cashier.png",
  },
  openGraph: {
    title: "Cashier — Aplikasi Kasir Modern untuk UMKM Indonesia",
    description:
      "POS cepat, stok akurat, laporan lengkap. Coba gratis 14 hari tanpa kartu kredit.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}