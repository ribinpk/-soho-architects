"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const REVEAL_AFTER_PX = 480;
const UP_THRESHOLD = 24;
const DOWN_THRESHOLD = 6;

export function StickyInquireCta({ label = "Inquire" }: { label?: string }) {
  const [visible, setVisible] = useState(false);
  const anchorY = useRef(0);
  const lastDir = useRef<"up" | "down">("down");

  useEffect(() => {
    anchorY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < REVEAL_AFTER_PX) {
        if (lastDir.current !== "down") {
          lastDir.current = "down";
          anchorY.current = y;
        }
        setVisible(false);
        return;
      }
      const delta = y - anchorY.current;
      if (lastDir.current === "down" && delta < -UP_THRESHOLD) {
        lastDir.current = "up";
        anchorY.current = y;
        setVisible(true);
      } else if (lastDir.current === "up" && delta > DOWN_THRESHOLD) {
        lastDir.current = "down";
        anchorY.current = y;
        setVisible(false);
      } else if (lastDir.current === "down" && delta > 0) {
        anchorY.current = y;
      } else if (lastDir.current === "up" && delta < 0) {
        anchorY.current = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="md:hidden pointer-events-none fixed inset-x-0 bottom-0 z-40 px-5 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <AnimatePresence>
        {visible && (
          <motion.div
            key="sticky-inquire"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] }}
            className="pointer-events-auto"
          >
            <Link
              href="/inquiries"
              className="press flex items-center justify-between h-12 px-5 bg-ink text-cream text-sm tracking-wide shadow-[0_8px_24px_-12px_rgba(0,0,0,0.4)]"
            >
              <span>{label}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
