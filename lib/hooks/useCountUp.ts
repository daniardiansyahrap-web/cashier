"use client";

import { useEffect, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";

export function useCountUp(target: number, duration = 1.2) {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? target : 0);

  useEffect(() => {
    if (reduce) {
      setValue(target);
      return;
    }
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (x) => setValue(Math.round(x)),
    });
    return () => controls.stop();
  }, [target, duration, reduce]);

  return value;
}