import {
  ShoppingCart,
  Package,
  Warehouse,
  BarChart3,
  Store,
  ScanBarcode,
  Receipt,
  Wifi,
  QrCode,
  MessageCircle,
  Printer,
  ClipboardList,
  Tag,
  Bell,
  TrendingUp,
  Users,
  FileSpreadsheet,
  LucideIcon,
} from "lucide-react";

// ============ FITUR UTAMA (BENTO) ============
export type Feature = {
  id: string;
  icon: LucideIcon;
  judul: string;
  deskripsi: string;
  badge?: string; // "Segera Hadir" untuk fitur yang belum ada
  color: string;
};

export const fiturUtama: Feature[] = [
  {
    id: "pos",
    icon: ShoppingCart,
    judul: "Kasir Cepat (POS)",
    deskripsi:
      "Transaksi < 10 detik. Scan barcode langsung masuk keranjang, hitung otomatis, langsung bayar.",
    color: "bg-brand-50 text-brand-600 border-brand-100",
  },
  {
    id: "barcode",
    icon: ScanBarcode,
    judul: "Barcode Scanner",
    deskripsi: "Scan pakai kamera HP atau scanner USB. Produk otomatis masuk.",
    color: "bg-teal-50 text-teal-600 border-teal-100",
  },
  {
    id: "laporan",
    icon: BarChart3,
    judul: "Laporan Lengkap",
    deskripsi: "Penjualan, produk terlaris, per metode bayar. Export CSV.",
    color: "bg-cyan-50 text-cyan-600 border-cyan-100",
  },
  {
    id: "produk",
    icon: Package,
    judul: "Manajemen Produk",
    deskripsi: "Kelola produk, harga, kategori. Import dari Excel.",
    badge: "Segera Hadir",
    color: "bg-indigo-50 text-indigo-600 border-indigo-100",
  },
  {
    id: "stok",
    icon: Warehouse,
    judul: "Manajemen Stok",
    deskripsi: "Stok masuk, keluar, opname. Highlight otomatis stok menipis.",
    color: "bg-slate-100 text-slate-700 border-slate-200",
  },
  {
    id: "outlet",
    icon: Store,
    judul: "Multi-Outlet",
    deskripsi: "Kelola banyak cabang. Transfer stok antar outlet.",
    color: "bg-sky-50 text-sky-600 border-sky-100",
  },
  {
    id: "struk",
    icon: Receipt,
    judul: "Cetak Struk Thermal",
    deskripsi: "Print struk ke printer thermal Bluetooth.",
    badge: "Segera Hadir",
    color: "bg-orange-50 text-orange-600 border-orange-100",
  },
];

// ============ FITUR KHAS INDONESIA ============
export const fiturIndonesia: Feature[] = [
  {
    id: "qris",
    icon: QrCode,
    judul: "Pembayaran QRIS",
    deskripsi: "Terima pembayaran QRIS & e-wallet.",
    badge: "Dalam Pengembangan",
    color: "bg-brand-50 text-brand-600",
  },
  {
    id: "offline",
    icon: Wifi,
    judul: "Mode Offline",
    deskripsi: "Tetap jualan walau internet mati. Sinkron otomatis saat online.",
    badge: "Segera Hadir",
    color: "bg-slate-100 text-slate-600",
  },
  {
    id: "wa-struk",
    icon: MessageCircle,
    judul: "Struk via WhatsApp",
    deskripsi: "Kirim struk langsung ke WhatsApp pelanggan.",
    badge: "Segera Hadir",
    color: "bg-green-50 text-green-600",
  },
  {
    id: "printer",
    icon: Printer,
    judul: "Printer Thermal Bluetooth",
    deskripsi: "Support printer thermal populer.",
    badge: "Segera Hadir",
    color: "bg-orange-50 text-orange-600",
  },
  {
    id: "kasbon",
    icon: ClipboardList,
    judul: "Kasbon / Piutang",
    deskripsi: "Catat pelanggan yang belum bayar.",
    badge: "Segera Hadir",
    color: "bg-amber-50 text-amber-600",
  },
  {
    id: "promo",
    icon: Tag,
    judul: "Harga Grosir & Promo",
    deskripsi: "Diskon, promo, harga khusus member.",
    badge: "Segera Hadir",
    color: "bg-pink-50 text-pink-600",
  },
  {
    id: "notif-stok",
    icon: Bell,
    judul: "Highlight Stok Menipis",
    deskripsi: "Stok di bawah minimum ditandai otomatis di tabel.",
    color: "bg-red-50 text-red-600",
  },
  {
    id: "laba-rugi",
    icon: TrendingUp,
    judul: "Laba Rugi",
    deskripsi: "Laporan untung/rugi per periode.",
    badge: "Segera Hadir",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    id: "shift",
    icon: Users,
    judul: "Shift Kasir & Hak Akses",
    deskripsi: "Kelola shift & role karyawan.",
    badge: "Segera Hadir",
    color: "bg-violet-50 text-violet-600",
  },
  {
    id: "excel",
    icon: FileSpreadsheet,
    judul: "Import Excel",
    deskripsi: "Upload produk dari Excel massal.",
    badge: "Segera Hadir",
    color: "bg-green-50 text-green-600",
  },
];

// ============ PAKET HARGA ============
export type PricingPlan = {
  id: string;
  nama: string;
  hargaBulanan: number;
  hargaTahunan: number; // per bulan kalau bayar tahunan
  deskripsi: string;
  fitur: string[];
  belumTermasuk?: string[];
  populer?: boolean;
};

export const paket: PricingPlan[] = [
  {
    id: "basic",
    nama: "Basic",
    hargaBulanan: 99000,
    hargaTahunan: 82500, // hemat 2 bulan
    deskripsi: "Cocok untuk toko kecil yang baru mulai",
    fitur: [
      "1 outlet",
      "2 user",
      "500 produk",
      "POS + Barcode",
      "Laporan dasar",
      "Support email",
    ],
    belumTermasuk: [
      "Multi-outlet",
      "Cetak struk",
      "Export CSV",
    ],
  },
  {
    id: "pro",
    nama: "Pro",
    hargaBulanan: 199000,
    hargaTahunan: 165833,
    deskripsi: "Untuk toko berkembang",
    fitur: [
      "3 outlet",
      "5 user",
      "2.000 produk",
      "POS + Barcode",
      "Laporan lengkap + Export CSV",
      "Manajemen stok lengkap",
      "Support WhatsApp",
    ],
    populer: true,
  },
  {
    id: "business",
    nama: "Business",
    hargaBulanan: 399000,
    hargaTahunan: 332500,
    deskripsi: "Untuk bisnis multi-cabang",
    fitur: [
      "10 outlet",
      "20 user",
      "Produk unlimited",
      "Semua fitur Pro",
      "Transfer stok antar outlet",
      "Laporan per outlet",
      "Prioritas support",
    ],
  },
];

// ============ FAQ ============
export type Faq = {
  q: string;
  a: string;
};

export const faqs: Faq[] = [
  {
    q: "Apakah data saya aman?",
    a: "Ya. Data disimpan terenkripsi di server cloud dan di-backup otomatis. Hanya kamu & tim yang punya akses.",
  },
  {
    q: "Bagaimana kalau internet mati?",
    a: "Saat ini Cashier butuh koneksi internet. Mode offline sedang dalam pengembangan.",
  },
  {
    q: "Bisa pindah dari aplikasi kasir lain?",
    a: "Bisa. Kami sedang menyiapkan fitur import produk dari Excel. Sementara ini kamu bisa input produk manual.",
  },
  {
    q: "Perangkat apa yang dibutuhkan?",
    a: "Cukup HP, tablet, atau komputer dengan browser modern (Chrome, Safari, Edge). Tidak perlu install.",
  },
  {
    q: "Printer apa yang didukung?",
    a: "Fitur cetak struk thermal masih dalam pengembangan. Setelah rilis, kami akan support printer thermal populer.",
  },
  {
    q: "Apakah bisa batal kapan saja?",
    a: "Ya. Kamu bisa batal kapan saja dari dashboard. Tidak ada kontrak minimum.",
  },
  {
    q: "Bagaimana setelah trial 14 hari berakhir?",
    a: "Kamu akan diingatkan H-3 sebelum trial berakhir. Kalau tidak upgrade, akun tetap ada tapi fitur terbatas.",
  },
  {
    q: "Ada pelatihan atau bantuan setup?",
    a: "Ya. Kami sediakan panduan setup 5 menit, dan bisa bantuan via WhatsApp untuk paket Pro & Business.",
  },
];

// ============ STATS ============
export const stats = [
  { angka: 14, suffix: " Hari", label: "Free Trial" },
  // TODO: Ganti dengan angka real setelah ada user
  { angka: 0, suffix: "", label: "Toko Terdaftar", todo: true },
  // TODO: Ganti dengan angka real setelah ada transaksi
  { angka: 0, suffix: "", label: "Transaksi Tercatat", todo: true },
  { angka: 5, suffix: " Menit", label: "Setup" },
];

// ============ KALKULATOR ============
export const kalkulatorAsumsi = {
  // TODO: Sesuaikan dengan tarif yang wajar di Indonesia
  gajiPerJam: 20000, // Rp 20.000/jam (UMR kasar)
  hariKerjaPerBulan: 26,
};

// ============ TIPE USAHA ============
export const jenisUsaha = [
  {
    id: "warung",
    nama: "Warung / Kelontong",
    emoji: "🏪",
    manfaat:
      "Catat penjualan cepat, gak perlu buku nota. Stok gampang dicek dari HP.",
    fiturAndalan: "POS + Barcode",
  },
  {
    id: "minimarket",
    nama: "Minimarket",
    emoji: "🛒",
    manfaat:
      "Kelola ratusan produk dengan barcode. Laporan harian otomatis, gak perlu rekap manual.",
    fiturAndalan: "Barcode + Laporan",
  },
  {
    id: "kafe",
    nama: "Kafe / Resto",
    emoji: "☕",
    manfaat:
      "Kasir cepat untuk jam sibuk. Pantau menu terlaris dari HP.",
    fiturAndalan: "POS + Laporan",
  },
  {
    id: "bangunan",
    nama: "Toko Bangunan",
    emoji: "🔨",
    manfaat:
      "Kelola stok banyak item. Transfer antar gudang & cabang.",
    fiturAndalan: "Multi-Outlet + Stok",
  },
  {
    id: "apotek",
    nama: "Apotek",
    emoji: "💊",
    manfaat:
      "Catat stok & tanggal expired. Laporan penjualan per produk.",
    fiturAndalan: "Stok + Laporan",
  },
  {
    id: "multi",
    nama: "Toko Multi-Cabang",
    emoji: "🏢",
    manfaat:
      "Satu dashboard untuk semua cabang. Bandingkan performa outlet.",
    fiturAndalan: "Multi-Outlet",
  },
];