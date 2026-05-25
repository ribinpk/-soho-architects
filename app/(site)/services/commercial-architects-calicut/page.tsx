import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { InquiryCta } from "@/components/site/InquiryCta";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbsJsonLd,
  faqPageJsonLd,
  serviceJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute: "Commercial Architects in Calicut | SOHO Architects",
  },
  description:
    "SOHO Architects designs offices, hotels, and institutional buildings in Calicut (Kozhikode), Kerala. Climate-first commercial architecture, founder-led.",
  alternates: { canonical: "/services/commercial-architects-calicut" },
  openGraph: {
    title: "Commercial Architects in Calicut | SOHO Architects",
    description:
      "Offices, small hotels, and institutional buildings across Kerala. Climate-first commercial architecture from SOHO Architects, Calicut.",
    url: "/services/commercial-architects-calicut",
  },
};

const FAQS: { q: string; a: string }[] = [
  {
    q: "What kinds of commercial projects do you take on?",
    a: "Offices and workplaces, small boutique hotels and retreats, restaurants, showrooms, and modest institutional buildings. We don’t do large-format retail or speculative mid-rise.",
  },
  {
    q: "Do you work with developers and operators, or only end-users?",
    a: "Both. We’ve worked with hospitality operators on small hotels, with founders building their own offices, and with families commissioning institutional buildings. Each engagement has the same founder-led pattern — one partner sees it through from brief to handover.",
  },
  {
    q: "Where in Kerala have you completed commercial work?",
    a: "Primarily Kozhikode and the wider Malabar region. We’ll travel for the right project elsewhere in India.",
  },
  {
    q: "How are commercial fees structured?",
    a: "Typically a percentage of construction cost, with a phased payment schedule pegged to design milestones. We discuss the basis openly at the first meeting and confirm in writing before any drawings begin.",
  },
  {
    q: "Can you take on interior fit-out only?",
    a: "Yes. Office and hospitality interior fit-out is part of the studio’s regular work. See our interior design page for more.",
  },
];

export default function CommercialServicePage() {
  const breadcrumbs = breadcrumbsJsonLd([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    {
      name: "Commercial architects in Calicut",
      path: "/services/commercial-architects-calicut",
    },
  ]);

  const service = serviceJsonLd({
    name: "Commercial architects in Calicut",
    description:
      "Commercial and workplace architecture — offices, small hotels, institutional buildings — in Calicut (Kozhikode) and across Kerala.",
    path: "/services/commercial-architects-calicut",
    serviceType: "Commercial architecture",
  });

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={service} />
      <JsonLd data={faqPageJsonLd(FAQS)} />
      <section className="pt-32 md:pt-44 pb-16 md:pb-24 border-b border-hairline">
        <Container>
          <Reveal>
            <span className="eyebrow">Commercial · Calicut, Kerala</span>
            <h1 className="mt-6 font-serif text-display tracking-tight max-w-[22ch]">
              Commercial architects in Calicut — workplaces, hospitality, institutions.
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-mute leading-relaxed">
              SOHO Architects designs offices, small hotels, and
              institutional buildings in Calicut (Kozhikode) and across
              Kerala. Founder-led, climate-first commercial architecture —
              daylight before screens, materials that age well, plans that
              outlast a single tenant.
            </p>
            <div className="mt-10 flex flex-wrap gap-3 text-sm">
              <Link
                href="/inquiries"
                className="press inline-flex items-center h-11 px-5 bg-ink text-cream hover:bg-ink-soft transition-colors"
              >
                Start a commercial inquiry →
              </Link>
              <Link
                href="/projects/soho-work-living"
                className="press inline-flex items-center h-11 px-5 text-mute hover:text-ink transition-colors"
              >
                See our own studio →
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-20 md:py-28 border-b border-hairline">
        <Container>
          <div className="md:grid md:grid-cols-12 md:gap-12">
            <div className="md:col-span-4">
              <Reveal>
                <span className="eyebrow">What we design</span>
                <h2 className="mt-6 font-serif text-headline tracking-tight max-w-[14ch]">
                  Workplaces that read the climate before the brief.
                </h2>
              </Reveal>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <Reveal delay={0.08}>
                <div className="space-y-5 text-body-lg leading-relaxed max-w-[58ch]">
                  <p>
                    Commercial buildings in Kerala are too often dressed for
                    a different climate — glass façades that need fighting
                    with air conditioning, plans that ignore the monsoon, a
                    fit-out cycle that throws good materials away every five
                    years. We build the other way.
                  </p>
                  <p>
                    The plan starts with daylight, cross-ventilation, and
                    shade — the same principles that have always worked on
                    this coast — and brings the screens in last. Materials
                    are chosen because they look better in ten years than
                    they do on opening day. Junctions are detailed so the
                    building can be cleaned and maintained without scaffolding
                    every monsoon.
                  </p>
                  <p>
                    The studio&apos;s own building, SOHO Work Living, is a
                    test case for this register. Everything we ask of clients
                    — the courtyard, the long verandah, the rough-hewn
                    materials — we asked of ourselves first.
                  </p>
                  <p>
                    Every commercial project is led by one of the three
                    founding partners, from brief to handover. We don&apos;t
                    hand it off to a team you only meet on signing day.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-28 border-b border-hairline">
        <Container>
          <Reveal>
            <span className="eyebrow">Featured commercial work</span>
            <h2 className="mt-6 font-serif text-headline max-w-[18ch]">
              The studio&apos;s own workspace in Calicut.
            </h2>
          </Reveal>
          <div className="mt-8">
            <Reveal delay={0.06}>
              <div className="border-t border-hairline pt-6">
                <h3 className="font-serif text-2xl md:text-3xl tracking-tight">
                  <Link
                    href="/projects/soho-work-living"
                    className="press hover:text-mute transition-colors"
                  >
                    SOHO Work Living
                    <span aria-hidden="true" className="ml-2 text-mute">
                      →
                    </span>
                  </Link>
                </h3>
                <p className="mt-3 text-body-lg text-mute max-w-[50ch]">
                  The studio&apos;s own building. A test case for everything
                  we ask of clients — courtyard, shade, long verandah, every
                  joint resolved twice.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-28 border-b border-hairline">
        <Container>
          <div className="md:grid md:grid-cols-12 md:gap-12">
            <div className="md:col-span-4">
              <Reveal>
                <span className="eyebrow">FAQ</span>
                <h2 className="mt-6 font-serif text-headline tracking-tight max-w-[16ch]">
                  Working with a commercial architect in Calicut.
                </h2>
              </Reveal>
            </div>
            <div className="md:col-span-8">
              <dl className="border-t border-hairline">
                {FAQS.map((item, i) => (
                  <Reveal key={item.q} delay={(i % 3) * 0.05}>
                    <div className="border-b border-hairline py-7 md:py-8">
                      <dt className="font-serif text-2xl md:text-[1.7rem] tracking-tight">
                        {item.q}
                      </dt>
                      <dd className="mt-3 text-body-lg text-mute leading-relaxed max-w-[60ch]">
                        {item.a}
                      </dd>
                    </div>
                  </Reveal>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-24 border-b border-hairline">
        <Container>
          <Reveal>
            <span className="eyebrow">Also from the studio</span>
          </Reveal>
          <div className="mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
            <Reveal>
              <Link
                href="/services/residential-architects-calicut"
                className="press group block border-t border-hairline pt-6"
              >
                <span className="eyebrow !text-mute">Service</span>
                <h3 className="mt-3 font-serif text-2xl md:text-3xl tracking-tight group-hover:text-mute transition-colors">
                  Residential architects in Calicut
                </h3>
                <p className="mt-3 text-sm text-mute max-w-[36ch]">
                  Houses, villas, and second homes across Kerala. Founder-led,
                  built for the climate.
                </p>
              </Link>
            </Reveal>
            <Reveal delay={0.06}>
              <Link
                href="/services/interior-designers-calicut"
                className="press group block border-t border-hairline pt-6"
              >
                <span className="eyebrow !text-mute">Service</span>
                <h3 className="mt-3 font-serif text-2xl md:text-3xl tracking-tight group-hover:text-mute transition-colors">
                  Interior designers in Calicut
                </h3>
                <p className="mt-3 text-sm text-mute max-w-[36ch]">
                  Workplace and hospitality interiors detailed the way the
                  building was drawn.
                </p>
              </Link>
            </Reveal>
            <Reveal delay={0.12}>
              <Link
                href="/insights"
                className="press group block border-t border-hairline pt-6"
              >
                <span className="eyebrow !text-mute">Writing</span>
                <h3 className="mt-3 font-serif text-2xl md:text-3xl tracking-tight group-hover:text-mute transition-colors">
                  Notes from the studio
                </h3>
                <p className="mt-3 text-sm text-mute max-w-[36ch]">
                  On building in Kerala — cost, climate, materials, and what
                  we have learned in fifteen years.
                </p>
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>

      <InquiryCta
        eyebrow="Start a commercial project"
        headline="Designing a workplace or small hotel?"
        subhead="Tell us about the site and the brief."
        ctaLabel="Start a commercial inquiry"
      />
    </>
  );
}
