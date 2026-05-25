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
    absolute: "Interior Designers in Calicut | SOHO Architects",
  },
  description:
    "SOHO Architects offers interior design and fit-out for homes and workplaces in Calicut (Kozhikode), Kerala. Founder-led, joinery-detailed, made to last.",
  alternates: { canonical: "/services/interior-designers-calicut" },
  openGraph: {
    title: "Interior Designers in Calicut | SOHO Architects",
    description:
      "Interior design and fit-out for homes and workplaces in Calicut, Kerala. Founder-led, every joint resolved twice.",
    url: "/services/interior-designers-calicut",
  },
};

const FAQS: { q: string; a: string }[] = [
  {
    q: "Do you do interior design for houses you didn’t architect?",
    a: "Yes. About a third of the studio’s interior work is on homes designed by other architects, or on existing rooms a family has lived in for years. We treat it the same way — measure the space, listen to how it’s used, draw before we buy.",
  },
  {
    q: "Do you handle furniture and joinery in-house?",
    a: "We design custom joinery — wardrobes, kitchens, beds, work desks, built-ins — and detail it for our preferred fabricators in and around Calicut. Loose furniture is curated, sourced, and where appropriate, custom-made.",
  },
  {
    q: "How long does an interior project usually take?",
    a: "A full apartment or house interior typically runs eight to twelve months from first meeting to handover — three to four months of design and procurement, then site work. Smaller single-room projects can finish in three to four months.",
  },
  {
    q: "How are interior fees structured?",
    a: "Usually a flat design fee plus a percentage of the procurement and execution cost. We confirm the basis in writing at the first meeting. We don’t take undisclosed commissions from vendors.",
  },
  {
    q: "Do you only work in Calicut?",
    a: "We work across Kerala — Kozhikode, Malappuram, Kannur, Wayanad, Thrissur, Kochi — and will travel for the right project elsewhere in India. Most interior projects need weekly site presence, so geography matters more here than for architecture.",
  },
];

export default function InteriorServicePage() {
  const breadcrumbs = breadcrumbsJsonLd([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    {
      name: "Interior designers in Calicut",
      path: "/services/interior-designers-calicut",
    },
  ]);

  const service = serviceJsonLd({
    name: "Interior designers in Calicut",
    description:
      "Interior design and fit-out for homes and workplaces in Calicut (Kozhikode) and across Kerala.",
    path: "/services/interior-designers-calicut",
    serviceType: "Interior design",
  });

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={service} />
      <JsonLd data={faqPageJsonLd(FAQS)} />
      <section className="pt-32 md:pt-44 pb-16 md:pb-24 border-b border-hairline">
        <Container>
          <Reveal>
            <span className="eyebrow">Interiors · Calicut, Kerala</span>
            <h1 className="mt-6 font-serif text-display tracking-tight max-w-[22ch]">
              Interior designers in Calicut — rooms drawn the way the building was.
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-mute leading-relaxed">
              SOHO Architects offers interior design and fit-out for homes
              and workplaces in Calicut (Kozhikode) and across Kerala.
              Joinery-led, materials-first, every junction resolved twice.
            </p>
            <div className="mt-10 flex flex-wrap gap-3 text-sm">
              <Link
                href="/inquiries"
                className="press inline-flex items-center h-11 px-5 bg-ink text-cream hover:bg-ink-soft transition-colors"
              >
                Start an interiors inquiry →
              </Link>
              <Link
                href="/projects"
                className="press inline-flex items-center h-11 px-5 text-mute hover:text-ink transition-colors"
              >
                See completed work
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
                  Rooms finished to the same standard the building was drawn to.
                </h2>
              </Reveal>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <Reveal delay={0.08}>
                <div className="space-y-5 text-body-lg leading-relaxed max-w-[58ch]">
                  <p>
                    Interior design is where a building is either resolved
                    or quietly given up on. A door pull, a skirting, the
                    junction between two materials — these decide whether a
                    room feels deliberate or merely complete.
                  </p>
                  <p>
                    The studio&apos;s interiors register is the same as its
                    architecture: local materials where they age well,
                    custom joinery detailed for fabricators we know, light
                    sources counted carefully, layered, never overhead-only.
                    Soft goods chosen to outlast the next trend cycle.
                  </p>
                  <p>
                    Our interior work runs across full-home fit-out, single
                    rooms, kitchens and bathrooms, workplace interiors, and
                    hospitality interiors. We work on homes we&apos;ve
                    architected and on homes we haven&apos;t — about a third
                    of the interior caseload is on buildings designed by
                    other practices.
                  </p>
                  <p>
                    Every interior project is led by Nabeel — the studio&apos;s
                    Principal Interior Designer — working with one of the
                    other founders where the architecture and interior cross.
                  </p>
                </div>
              </Reveal>
            </div>
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
                  Working with an interior designer in Calicut.
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
                  Houses across Kerala, drawn from the site outward.
                </p>
              </Link>
            </Reveal>
            <Reveal delay={0.06}>
              <Link
                href="/services/commercial-architects-calicut"
                className="press group block border-t border-hairline pt-6"
              >
                <span className="eyebrow !text-mute">Service</span>
                <h3 className="mt-3 font-serif text-2xl md:text-3xl tracking-tight group-hover:text-mute transition-colors">
                  Commercial architects in Calicut
                </h3>
                <p className="mt-3 text-sm text-mute max-w-[36ch]">
                  Offices, small hotels, and institutional projects in Kerala.
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
                  Cost, climate, materials, and what we have learned
                  along the way.
                </p>
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>

      <InquiryCta
        eyebrow="Start an interior project"
        headline="Bringing a room, or a whole home, into focus?"
        subhead="Tell us where, when, and what you'd like to make."
        ctaLabel="Start an interiors inquiry"
      />
    </>
  );
}
