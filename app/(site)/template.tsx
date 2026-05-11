"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Per-route mount animation: the page content rises into view while a
 * subtle "curtain" sweeps off the top, giving each navigation a sense of
 * stage entrance. Reduced-motion users get an instant reveal — same DOM
 * structure to avoid hydration mismatch.
 */
export default function SiteTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const prefersReduced = useReducedMotion();
  const curtainDuration = prefersReduced ? 0 : 0.75;
  const contentDuration = prefersReduced ? 0 : 0.55;
  const contentDelay = prefersReduced ? 0 : 0.35;
  const curtainDelay = prefersReduced ? 0 : 0.05;

  return (
    <>
      <motion.div
        aria-hidden="true"
        initial={{ clipPath: "inset(0 0 0 0)" }}
        animate={{ clipPath: "inset(0 0 100% 0)" }}
        transition={{
          duration: curtainDuration,
          ease: [0.83, 0, 0.17, 1],
          delay: curtainDelay,
        }}
        className="fixed inset-0 z-[60] bg-ink pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
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
