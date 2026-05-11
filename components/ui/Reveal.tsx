"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Distance to translate in px on the y-axis. Defaults to 24. */
  offset?: number;
} & Omit<HTMLMotionProps<"div">, "initial" | "whileInView" | "transition" | "viewport">;

export function Reveal({
  children,
  delay = 0,
  offset = 24,
  className,
  ...rest
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 0.61, 0.36, 1],
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
