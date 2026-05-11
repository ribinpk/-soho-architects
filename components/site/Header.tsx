"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";
import { NAV_ITEMS } from "./nav-items";

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
          className="flex items-center justify-between h-16 md:h-20"
        >
          <Link
            href="/"
            aria-label="SOHO Architects — home"
            className="flex items-center gap-2"
          >
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {NAV_ITEMS.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm tracking-wide transition-colors",
                    active ? "text-ink" : "text-mute hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="md:hidden -mr-2 size-10 flex items-center justify-center"
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
        </Container>
      </header>

      <MobileNav open={open} onClose={() => setOpen(false)} />
    </>
  );
}
