"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect } from "react";
import { NAV_ITEMS } from "./nav-items";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileNav({ open, onClose }: MobileNavProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-nav"
          className="fixed inset-0 z-50 md:hidden"
          initial="closed"
          animate="open"
          exit="closed"
        >
          <motion.button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]"
            variants={{ open: { opacity: 1 }, closed: { opacity: 0 } }}
            transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
          />
          <motion.aside
            className="absolute right-0 top-0 h-full w-full max-w-sm bg-cream shadow-xl flex flex-col"
            variants={{
              open: { x: 0 },
              closed: { x: "100%" },
            }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 32,
              mass: 0.9,
            }}
            style={{ paddingTop: "env(safe-area-inset-top)" }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-hairline">
              <span className="eyebrow">Menu</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="press size-11 -mr-2 flex items-center justify-center"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 4l12 12M16 4L4 16"
                    stroke="currentColor"
                    strokeWidth="1.25"
                  />
                </svg>
              </button>
            </div>
            <nav className="flex-1 px-6 py-10 flex flex-col gap-2">
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.18 + i * 0.06,
                    ease: [0.22, 0.61, 0.36, 1],
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="press block font-serif text-[44px] leading-none tracking-tight py-3 hover:text-mute transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.div
              className="px-6 py-6 border-t border-hairline text-xs text-mute"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
            >
              SOHO Architects · Kozhikode
            </motion.div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
