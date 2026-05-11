"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Max translation in px before spring damping. Defaults to 14. */
  intensity?: number;
};

/**
 * Wraps a single interactive element and pulls it toward the cursor when the
 * pointer is near. Desktop only (`pointer: fine`). Respects reduced-motion.
 */
export function Magnetic({ children, className, intensity = 14 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 320, damping: 22, mass: 0.45 });
  const sy = useSpring(y, { stiffness: 320, damping: 22, mass: 0.45 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mql = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mql.matches || reduced.matches) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / r.width;
      const dy = (e.clientY - cy) / r.height;
      x.set(dx * intensity);
      y.set(dy * intensity);
    };
    const onLeave = () => {
      x.set(0);
      y.set(0);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [intensity, x, y]);

  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} className={className}>
      {children}
    </motion.div>
  );
}
