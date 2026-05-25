import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { NAV_ITEMS } from "./nav-items";
import { STUDIO_EMAIL, STUDIO_PHONES } from "@/lib/contact";
import { SOCIAL_LINKS } from "@/lib/social";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 md:mt-40 border-t border-hairline">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          <div className="md:col-span-4">
            <Link href="/" aria-label="SOHO Architects — home" className="press inline-block">
              <Logo />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-mute">
              An architecture and interiors practice in Kozhikode, working
              across homes, workplaces, and quiet rooms.
            </p>
          </div>

          <nav className="md:col-span-2" aria-label="Site">
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
              <li>
                <Link
                  href="/insights"
                  className="press inline-flex items-center min-h-11 text-ink hover:text-mute transition-colors"
                >
                  Insights
                </Link>
              </li>
            </ul>
          </nav>

          <div className="md:col-span-3">
            <span className="eyebrow">Studio</span>
            <address className="mt-4 not-italic text-sm leading-relaxed text-mute">
              SOHO Architects
              <br />
              Golf Link Road, Malaparamba
              <br />
              Kozhikode, Kerala 673009
            </address>
            <ul className="mt-4 space-y-1 text-sm">
              {STUDIO_PHONES.map((p) => (
                <li key={p.tel}>
                  <a
                    href={`tel:${p.tel}`}
                    data-event="phone_click"
                    data-event-source="footer"
                    data-event-value={p.tel}
                    className="press text-ink hover:text-mute transition-colors tabular-nums"
                  >
                    {p.display}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${STUDIO_EMAIL}`}
                  data-event="email_click"
                  data-event-source="footer"
                  className="press text-ink hover:text-mute transition-colors"
                >
                  {STUDIO_EMAIL}
                </a>
              </li>
            </ul>
          </div>

          <nav className="md:col-span-3" aria-label="Elsewhere">
            <span className="eyebrow">Elsewhere</span>
            <ul className="mt-4 space-y-1 text-sm">
              {SOCIAL_LINKS.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="me noopener noreferrer"
                    data-event="social_click"
                    data-event-source="footer"
                    data-event-value={s.platform}
                    className="press inline-flex items-center min-h-11 text-ink hover:text-mute transition-colors"
                  >
                    <span className="w-24 text-mute">{s.platform}</span>
                    <span>{s.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 pt-6 border-t border-hairline flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-mute">
          <span>© {year} SOHO Architects. Drawn and built in Kozhikode.</span>
          <span>All rights reserved.</span>
        </div>
      </Container>
    </footer>
  );
}
