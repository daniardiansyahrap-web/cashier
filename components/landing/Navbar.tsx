"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
    { label: "Fitur", href: "#fitur" },
    { label: "Harga", href: "#harga" },
    { label: "Testimoni", href: "#testimoni" },
    { label: "FAQ", href: "#faq" },
];

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                        ? "bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm"
                        : "bg-transparent"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex justify-between items-center h-16 md:h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <img
                                src={scrolled ? "/logo-full-dark.png" : "/logo-full.png"}
                                alt="Cashier"
                                className="h-9 md:h-10 object-contain transition-all"
                            />
                        </Link>

                        {/* Menu Desktop */}
                        <div className="hidden md:flex items-center gap-1">
                            {menuItems.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${scrolled
                                            ? "text-slate-700 hover:bg-slate-100"
                                            : "text-white/90 hover:bg-white/10"
                                        }`}
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>

                        {/* CTA Desktop */}
                        <div className="hidden md:flex items-center gap-2">
                            <Link href="/login">
                                <button
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${scrolled
                                            ? "text-slate-700 hover:bg-slate-100"
                                            : "text-white hover:bg-white/10"
                                        }`}
                                >
                                    Login
                                </button>
                            </Link>
                            <Link href="/register">
                                <button className="px-5 py-2.5 rounded-full text-sm font-semibold bg-accent-500 hover:bg-accent-600 text-white transition-colors shadow-lg shadow-accent-500/20">
                                    Coba Gratis
                                </button>
                            </Link>
                        </div>

                        {/* Hamburger Mobile */}
                        <button
                            onClick={() => setOpen(!open)}
                            className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? "text-slate-700 hover:bg-slate-100" : "text-white hover:bg-white/10"
                                }`}
                            aria-label="Buka menu"
                        >
                            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-x-0 top-16 z-40 md:hidden bg-white border-b border-slate-200 shadow-lg"
                    >
                        <div className="px-4 py-4 space-y-1">
                            {menuItems.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className="block px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
                                >
                                    {item.label}
                                </a>
                            ))}
                            <div className="pt-3 border-t border-slate-100 space-y-2">
                                <Link href="/login" className="block">
                                    <button className="w-full px-4 py-3 rounded-full text-slate-700 hover:bg-slate-100 font-medium text-left">
                                        Login
                                    </button>
                                </Link>
                                <Link href="/register" className="block">
                                    <button className="w-full px-4 py-3 rounded-full bg-accent-500 hover:bg-accent-600 text-white font-semibold shadow-lg shadow-accent-500/20">
                                        Coba Gratis 14 Hari
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}