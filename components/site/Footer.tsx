import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { NAV_ITEMS } from "./nav-items";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 md:mt-40 border-t border-hairline">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          <div className="md:col-span-5">
            <Link href="/" aria-label="SOHO Architects — home" className="press inline-block">
              <Logo />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-mute">
              An interior and architecture studio working across residential,
              commercial, and workspace projects.
            </p>
          </div>

          <nav className="md:col-span-3" aria-label="Site">
            <span className="eyebrow">Site</span>
            <ul className="mt-4 space-y-1 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="press inline-flex items-center min-h-11 text-ink hover:text-mute transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <span className="eyebrow">Studio</span>
            <address className="mt-4 not-italic text-sm leading-relaxed text-mute">
              SOHO Architects
              <br />
              Golf Link Road, Malaparamba
              <br />
              Kozhikode, Kerala 673009
            </address>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-hairline flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-mute">
          <span>© {year} SOHO Architects. All rights reserved.</span>
          <span>Designed and built in 2026</span>
        </div>
      </Container>
    </footer>
  );
}
