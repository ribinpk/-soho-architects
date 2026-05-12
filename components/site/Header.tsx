"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { AnimatePresence } from "motion/react";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";
import { NAV_ITEMS } from "./nav-items";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-30 transition-[background-color,border-color] duration-300",
          scrolled
            ? "bg-cream/85 backdrop-blur-md border-b border-hairline"
            : "bg-transparent border-b border-transparent",
        )}
      >
        <Container
          as="div"
          className={cn(
            "flex items-center justify-between transition-[height] duration-300 ease-[var(--ease-soft)]",
            scrolled ? "h-20 md:h-24" : "h-24 md:h-28",
          )}
        >
          <Link
            href="/"
            aria-label="SOHO Architects — home"
            className="press flex items-center gap-2 transition-opacity"
          >
            <Logo compact={scrolled} />
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {NAV_ITEMS.map((item) => {
              const active =
                pathname === item.href ||
                pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "press relative py-1 text-sm tracking-wide transition-colors",
                    active ? "text-ink" : "text-mute hover:text-ink",
                  )}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="active-nav-indicator"
                      className="absolute left-0 right-0 -bottom-0.5 h-px bg-ink"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 -mr-2">
            <AnimatePresence>
              {scrolled && pathname !== "/inquiries" && (
                <motion.div
                  key="cta"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{
                    duration: 0.32,
                    ease: [0.22, 0.61, 0.36, 1],
                  }}
                  className="hidden md:inline-flex mr-3"
                >
                  <Link
                    href="/inquiries"
                    className="press inline-flex items-center h-9 px-4 text-xs tracking-wide bg-ink text-cream hover:bg-ink-soft transition-colors"
                  >
                    Start a project
                    <span aria-hidden="true" className="ml-2">
                      →
                    </span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="press md:hidden size-11 flex items-center justify-center"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 7h16M3 15h16"
                  stroke="currentColor"
                  strokeWidth="1.25"
                />
              </svg>
            </button>
          </div>
        </Container>
      </header>

      <MobileNav open={open} onClose={() => setOpen(false)} />
    </>
  );
}
