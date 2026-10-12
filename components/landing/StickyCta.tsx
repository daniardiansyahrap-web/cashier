"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 800);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur border-t border-slate-200 p-3 pb-4 shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">
                Gratis 14 hari
              </div>
              <div className="text-[10px] text-slate-500">
                Tanpa kartu kredit
              </div>
            </div>
            <Link href="/register">
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="bg-accent-500 hover:bg-accent-600 text-white font-bold text-sm px-5 py-3 rounded-full shadow-lg shadow-accent-500/30 flex items-center gap-1.5 whitespace-nowrap"
              >
                Coba Gratis
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}