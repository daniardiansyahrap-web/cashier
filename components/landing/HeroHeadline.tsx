"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const ORBIT = "M300 12 C 130 4, 8 80, 28 150 C 48 224, 320 262, 536 168";

export function HeroHeadline({ as: Tag = "h1" }: { as?: "h1" | "h2" }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const go = inView || !!reduce;

  return (
    <div
      ref={ref}
      className="relative w-full max-w-[600px] sm:aspect-[560/270] sm:[container-type:inline-size] lg:-translate-x-[12%]"
    >
      {/* Orbit: hanya untuk layar >= 640px */}
      <svg
        viewBox="0 0 560 270"
        aria-hidden="true"
        className="absolute inset-0 hidden h-full w-full overflow-visible sm:block"
      >
        <defs>
          <linearGradient id="orbit-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#4f7bff" stopOpacity="0" />
            <stop offset="0.45" stopColor="#4f7bff" stopOpacity="0.9" />
            <stop offset="1" stopColor="#8fb0ff" />
          </linearGradient>
        </defs>

        <motion.path
          d={ORBIT}
          fill="none"
          stroke="url(#orbit-grad)"
          strokeWidth={1.6}
          strokeLinecap="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: go ? 1 : 0 }}
          transition={{ duration: 2.2, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
        />

        {go &&
          (reduce ? (
            <circle cx="536" cy="168" r="5.5" fill="#8fb0ff" />
          ) : (
            <circle r="5.5" fill="#8fb0ff">
              <animateMotion
                path={ORBIT}
                dur="2.2s"
                begin="0.3s"
                fill="freeze"
                calcMode="spline"
                keyTimes="0;1"
                keySplines="0.4 0 0.2 1"
              />
            </circle>
          ))}
      </svg>

      <div className="sm:absolute sm:left-[12%] sm:top-[20%]">
        <Tag className="font-display text-[36px] font-bold leading-[1.12] tracking-[-0.04em] text-[#fafaf9] sm:text-[length:9.2cqw]">
          Berapa untung
          <br />
          hari ini?
          <span className="mt-2 block text-[28px] font-semibold leading-[1.14] tracking-[-0.03em] text-[#8d96b3] sm:mt-[1.8cqw] sm:text-[length:7.4cqw]">
            Buka HP, langsung
            <br />
            tahu.
          </span>
        </Tag>
      </div>
    </div>
  );
}