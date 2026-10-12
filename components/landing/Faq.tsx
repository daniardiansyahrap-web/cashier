"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { faqs } from "@/lib/landing-data";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  // JSON-LD untuk SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <section
      id="faq"
      className="relative py-20 md:py-28 px-4 bg-gradient-to-b from-slate-50 to-white"
    >
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest shadow-sm">
            <span className="w-1.5 h-1.5 bg-accent-500 rounded-full animate-pulse" />
            FAQ
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-slate-900">
            Pertanyaan yang sering ditanya
          </h2>
          <p className="text-slate-600">
            Gak nemu jawaban? Chat kami via WhatsApp.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = open === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className={`bg-white rounded-2xl border transition-all ${
                  isOpen
                    ? "border-accent-300 shadow-lg shadow-accent-500/10"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : idx)}
                  className="w-full flex items-start justify-between gap-4 p-5 md:p-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`font-display font-bold text-base md:text-lg ${
                      isOpen ? "text-accent-600" : "text-slate-900"
                    }`}
                  >
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen
                        ? "bg-accent-500 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="w-4 h-4" strokeWidth={3} />
                    ) : (
                      <Plus className="w-4 h-4" strokeWidth={3} />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 md:px-6 pb-5 md:pb-6 text-slate-600 leading-relaxed text-sm">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}