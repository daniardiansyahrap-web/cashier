"use client";

import { Plus } from "lucide-react";

export function TodayNotesDesktop() {
  return (
    <div className="flex flex-col min-w-0 bg-white border border-[#dde1ec] rounded-[10px] p-[22px] h-full tabular-nums">
      {/* Header dengan Tombol di Kanan */}
      <div className="flex items-center justify-between pb-3 mb-1 border-b border-[#eceef4]">
        <h3 className="text-[13px] font-extrabold tracking-[-0.01em] text-[#0b1230]">
          Catatan hari ini
        </h3>
        
        {/* Tombol Tambah Catatan (Pojok Kanan Atas) */}
        <button
          onClick={() => alert("Fitur tambah catatan akan segera hadir!")}
          className="h-[28px] px-2.5 rounded-md border border-[#dde1ec] bg-white text-[#0b1230] text-[11px] font-bold flex items-center gap-1.5 hover:bg-[#f6f7fb] transition-colors"
        >
          <Plus className="size-3.5" strokeWidth={2.5} />
          Tambah catatan
        </button>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center flex-1 py-6 text-center">
        {/* Ilustrasi SVG kustom */}
        <div className="relative mb-3">
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#d6dbe8]"
          >
            {/* Kertas */}
            <rect x="14" y="8" width="36" height="44" rx="4" fill="#f6f7fb" stroke="currentColor" strokeWidth="2" />
            {/* Garis teks */}
            <line x1="20" y1="18" x2="44" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="20" y1="26" x2="44" y2="26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="20" y1="34" x2="34" y2="34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            {/* Pensil */}
            <path d="M42 38L48 32L52 36L46 42L42 42V38Z" fill="#1d4ed8" />
            <path d="M48 32L50 30C50.8 29.2 52 29.2 52.8 30C53.6 30.8 53.6 32 52.8 32.8L50 34L48 32Z" fill="#1d4ed8" opacity="0.5" />
            {/* Efek garis */}
            <path d="M54 20L56 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M8 30L6 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M10 40L8 42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Teks */}
        <h4 className="text-[13px] font-bold text-[#0b1230] mb-1">
          Belum ada catatan.
        </h4>
        <p className="text-[11.5px] text-[#757895] leading-snug max-w-[200px] mx-auto">
          Gunakan catatan untuk mencatat hal penting di hari ini.
        </p>
      </div>
    </div>
  );
}