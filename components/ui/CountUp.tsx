"use client";

import { animate, useInView, useMotionValue, useTransform } from "motion/react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";

type Props = {
  to: number;
  /** Animation duration in seconds. */
  duration?: number;
  /** How far below `to` to start counting from. Smaller = subtler. */
  span?: number;
  className?: string;
};

/**
 * Counts up from `to - span` to `to` when scrolled into view. Used for years,
 * stats, etc. Triggers once.
 */
export function CountUp({ to, duration = 1.2, span = 12, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const count = useMotionValue(to - span);
  const rounded = useTransform(count, (v) => Math.round(v).toString());

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [inView, count, to, duration]);

  return (
    <motion.span ref={ref} className={className}>
      {rounded}
    </motion.span>
  );
}
