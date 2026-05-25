"use client";

import { useEffect, useRef, useState } from "react";

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
 * stats, etc. Triggers once. Uses a native IntersectionObserver + rAF so the
 * count reliably resolves even when nested inside a motion `whileInView` wrapper.
 */
export function CountUp({ to, duration = 1.2, span = 12, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const from = to - span;
  const [value, setValue] = useState(from);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let raf = 0;
    let observer: IntersectionObserver | null = null;
    let started = false;

    const run = () => {
      if (started) return;
      started = true;
      const startTime = performance.now();
      const tick = (now: number) => {
        const elapsed = Math.min((now - startTime) / (duration * 1000), 1);
        // easeOutQuart — matches the motion ease the rest of the site uses
        const eased = 1 - Math.pow(1 - elapsed, 4);
        setValue(Math.round(from + (to - from) * eased));
        if (elapsed < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    if (typeof IntersectionObserver === "undefined") {
      run();
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            run();
            observer?.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);

    return () => {
      observer?.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [to, from, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
