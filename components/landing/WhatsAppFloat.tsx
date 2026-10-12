"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { WA_LINK } from "@/lib/constants";

export function WhatsAppFloat() {
  return (
    <motion.a
      href={WA_LINK}
      target="_blank"
      rel="noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, type: "spring", stiffness: 300 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-2xl shadow-green-500/40 flex items-center justify-center group"
      aria-label="Chat via WhatsApp"
    >
      <MessageCircle className="w-7 h-7" strokeWidth={2.5} />

      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30" />

      {/* Tooltip */}
      <span className="absolute right-16 bg-slate-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Chat kami
        <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
      </span>
    </motion.a>
  );
}