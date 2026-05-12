"use client";

import { motion } from "motion/react";
import { Fragment } from "react";

type Props = {
  items: string[];
  /** Seconds for one full loop. Larger = slower. */
  duration?: number;
  className?: string;
};

/**
 * Continuously-scrolling text strip. Pauses on hover. Duplicates content so
 * the loop is seamless. Each item is separated by a hairline diamond.
 */
export function Marquee({ items, duration = 38, className }: Props) {
  // Duplicate so the translation can wrap seamlessly.
  const cycle = [...items, ...items];

  return (
    <div
      data-cursor="scrub"
      className={`relative w-full overflow-hidden border-y border-hairline py-5 md:py-7 ${className ?? ""}`}
      aria-hidden="true"
    >
      <motion.div
        className="flex whitespace-nowrap will-change-transform"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {cycle.map((item, i) => (
          <Fragment key={i}>
            <span className="font-serif text-3xl md:text-5xl tracking-tight mx-6 md:mx-10">
              {item}
            </span>
            <span className="self-center text-mute select-none">◆</span>
          </Fragment>
        ))}
      </motion.div>
    </div>
  );
}
