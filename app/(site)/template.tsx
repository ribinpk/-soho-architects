"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Per-route mount animation: the page content rises into view while a
 * subtle "curtain" sweeps off the top, giving each navigation a sense of
 * stage entrance. Reduced-motion users get an instant reveal — same DOM
 * structure to avoid hydration mismatch.
 *
 * Note on `mounted` / `initial={false}`: motion's `useReducedMotion()`
 * returns `null` during SSR and resolves true/false on the client, which
 * can cause its auto-on-mount animation to advance past the `initial`
 * state before React's hydration consistency check runs (especially with
 * reduced-motion users, where transitions are instant). We pin the initial
 * paint to a known state and only kick off the animation in a useEffect.
 */
export default function SiteTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const curtainDuration = prefersReduced ? 0 : 0.75;
  const contentDuration = prefersReduced ? 0 : 0.55;
  const contentDelay = prefersReduced ? 0 : 0.35;
  const curtainDelay = prefersReduced ? 0 : 0.05;

  return (
    <>
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{ y: mounted ? "-100%" : "0%" }}
        transition={{
          duration: curtainDuration,
          ease: [0.83, 0, 0.17, 1],
          delay: curtainDelay,
        }}
        className="fixed inset-0 z-[60] bg-ink pointer-events-none"
      />
      <motion.div
        initial={false}
        animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 12 }}
        transition={{
          duration: contentDuration,
          ease: [0.16, 1, 0.3, 1],
          delay: contentDelay,
        }}
      >
        {children}
      </motion.div>
    </>
  );
}
