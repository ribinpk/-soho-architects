"use client";

import { motion, type Variants } from "motion/react";
import { Fragment, type ElementType } from "react";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Stagger per word, seconds. */
  stagger?: number;
};

const container: Variants = {
  hidden: {},
  visible: (custom: { delay: number; stagger: number }) => ({
    transition: {
      delayChildren: custom.delay,
      staggerChildren: custom.stagger,
    },
  }),
};

const word: Variants = {
  hidden: { y: "62%", opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/**
 * Splits text into words, wraps each in a clipped inline-block that animates
 * up into view with a stagger. Use for editorial headlines.
 */
export function SplitText({
  text,
  as: Tag = "span",
  className,
  delay = 0.15,
  stagger = 0.04,
}: Props) {
  const words = text.split(" ");

  return (
    <Tag className={className}>
      <motion.span
        className="inline"
        initial="hidden"
        animate="visible"
        variants={container}
        custom={{ delay, stagger }}
        aria-label={text}
      >
        {words.map((w, i) => (
          <Fragment key={i}>
            <span
              aria-hidden="true"
              className="inline-block overflow-hidden align-baseline"
            >
              <motion.span
                className="inline-block"
                variants={word}
                style={{ willChange: "transform" }}
              >
                {w}
              </motion.span>
            </span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  );
}
