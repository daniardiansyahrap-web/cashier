"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-white/15 bg-white/5 text-white/90 text-[13px] font-semibold hover:bg-white/10 hover:border-white/25 transition-colors"
    >
      <LogOut className="size-4" strokeWidth={1.9} aria-hidden />
      <span>Keluar</span>
    </button>
  );
}