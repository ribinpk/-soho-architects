import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { InquiryCta } from "@/components/site/InquiryCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, breadcrumbsJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute: "Architectural Services in Calicut | SOHO Architects",
  },
  description:
    "Architectural services from SOHO Architects in Calicut (Kozhikode), Kerala — residential architecture, commercial and workplace design, and interior design.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Architectural Services in Calicut | SOHO Architects",
    description:
      "Residential, commercial, and interior design services across Kerala. Founder-led, climate-responsive, from our studio in Calicut.",
    url: "/services",
  },
};

const SERVICES: {
  title: string;
  href: string;
  eyebrow: string;
  detail: string;
}[] = [
  {
    title: "Residential architects in Calicut",
    href: "/services/residential-architects-calicut",
    eyebrow: "Homes & villas",
    detail:
      "Houses, villas, and second homes across Kerala — designed for monsoon, daylight, and the way families actually live.",
  },
  {
    title: "Commercial architects in Calicut",
    href: "/services/commercial-architects-calicut",
    eyebrow: "Workplaces & hospitality",
    detail:
      "Offices, small hotels and retreats, institutional projects. Climate-first, daylight before screens, materials that age well.",
  },
  {
    title: "Interior designers in Calicut",
    href: "/services/interior-designers-calicut",
    eyebrow: "Interiors & fit-out",
    detail:
      "Interior design and fit-out for homes and workplaces — rooms detailed to the same standard the building was drawn to.",
  },
];

export default function ServicesIndexPage() {
  const breadcrumbs = breadcrumbsJsonLd([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
  ]);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Architectural services in Calicut",
    itemListElement: SERVICES.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.title,
      url: absoluteUrl(s.href),
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={itemList} />
      <section className="pt-32 md:pt-44 pb-16 md:pb-24 border-b border-hairline">
        <Container>
          <Reveal>
            <span className="eyebrow">Services · Calicut, Kerala</span>
            <h1 className="mt-6 font-serif text-headline max-w-[22ch]">
              Architectural services in Calicut, Kerala.
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-mute">
              SOHO Architects is a founder-led architecture and interior
              design firm in Calicut (Kozhikode). We work across three
              lines — homes, workplaces, and interiors — primarily in Kerala,
              with the occasional project further afield in India.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 md:py-28">
        <Container>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-y-0 md:gap-x-8">
            {SERVICES.map((s, i) => (
              <Reveal key={s.href} delay={i * 0.06}>
                <li className="md:border-l md:border-hairline md:pl-6 first:md:border-l-0 first:md:pl-0">
                  <span className="eyebrow">{s.eyebrow}</span>
                  <h2 className="mt-5 font-serif text-2xl md:text-3xl tracking-tight">
                    <Link
                      href={s.href}
                      className="press hover:text-mute transition-colors"
                    >
                      {s.title}
                      <span aria-hidden="true" className="ml-2 text-mute">
                        →
                      </span>
                    </Link>
                  </h2>
                  <p className="mt-3 text-body-lg text-mute max-w-[36ch]">
                    {s.detail}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <InquiryCta />
    </>
  );
}
