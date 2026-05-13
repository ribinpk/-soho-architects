import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { InquiryCta } from "@/components/site/InquiryCta";
import { ProcessTimeline } from "@/components/site/ProcessTimeline";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbsJsonLd,
  faqPageJsonLd,
  serviceJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute: "Residential Architects in Calicut | SOHO Architects",
  },
  description:
    "SOHO Architects designs houses, villas, and second homes in Calicut (Kozhikode) and across Kerala. Founder-led residential architecture since 2011.",
  alternates: { canonical: "/services/residential-architects-calicut" },
  openGraph: {
    title: "Residential Architects in Calicut | SOHO Architects",
    description:
      "Houses, villas, and second homes across Kerala. Founder-led residential architecture from SOHO Architects, Calicut.",
    url: "/services/residential-architects-calicut",
  },
};

const FEATURED_HOUSES: { slug: string; name: string; blurb: string }[] = [
  {
    slug: "valley-house",
    name: "Valley House",
    blurb: "A house that gives the hillside back its view.",
  },
  {
    slug: "mathamangalam-house",
    name: "Mathamangalam House",
    blurb: "Laterite, shade, and a long verandah for the rain.",
  },
  {
    slug: "payyavoor-house",
    name: "Payyavoor House",
    blurb: "A courtyard at the centre, the plan arranged around it.",
  },
  {
    slug: "sanctum-of-solace",
    name: "Sanctum of Solace",
    blurb: "A home built to be quieter than the street outside.",
  },
  {
    slug: "la-vie",
    name: "La Vie",
    blurb: "Light from the east, kept low until noon.",
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "Do you only work on houses in Calicut?",
    a: "Most of our residential work is in Kozhikode, Malappuram, Kannur, Wayanad, and Thrissur — the parts of Kerala we know best. We’ll travel for the right project elsewhere in India, but Calicut and the Malabar coast remain the home register.",
  },
  {
    q: "What size of house do you take on?",
    a: "Anywhere from a 1,500 sq ft home to a 12,000 sq ft villa. We’ve found the architect’s contribution matters most on smaller and mid-sized plots, where every square foot has to earn its place.",
  },
  {
    q: "How much do residential architects in Calicut charge?",
    a: "Fees are typically a percentage of the project cost — 6% to 10% in our case, depending on the level of detail, custom joinery, and interior design involvement. We confirm the basis at the first meeting, before any work begins.",
  },
  {
    q: "Do you handle interiors and landscape as well?",
    a: "Yes. Most clients ask us to stay through interiors — finishes, joinery, lighting, soft goods. We also coordinate landscape designers where the site needs it. The building reads better when one studio sees it through.",
  },
  {
    q: "What’s the timeline from first meeting to moving in?",
    a: "Eighteen to thirty months is typical, end-to-end. Roughly four to six months of design and drawings, then construction. Larger or more bespoke houses run longer — we’d rather give the building the time it asks for.",
  },
];

export default function ResidentialServicePage() {
  const breadcrumbs = breadcrumbsJsonLd([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    {
      name: "Residential architects in Calicut",
      path: "/services/residential-architects-calicut",
    },
  ]);

  const service = serviceJsonLd({
    name: "Residential architects in Calicut",
    description:
      "Residential architecture for houses, villas, and second homes in Calicut (Kozhikode) and across Kerala.",
    path: "/services/residential-architects-calicut",
    serviceType: "Residential architecture",
  });

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={service} />
      <JsonLd data={faqPageJsonLd(FAQS)} />
      <section className="pt-32 md:pt-44 pb-16 md:pb-24 border-b border-hairline">
        <Container>
          <Reveal>
            <span className="eyebrow">Residential · Calicut, Kerala</span>
            <h1 className="mt-6 font-serif text-display tracking-tight max-w-[22ch]">
              Residential architects in Calicut, designing houses for Kerala.
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-mute leading-relaxed">
              SOHO Architects is a residential architecture practice in
              Calicut (Kozhikode), Kerala. We design houses, villas, and
              second homes for clients across Malabar — Kozhikode,
              Malappuram, Kannur, Wayanad — and occasionally further afield
              in India.
            </p>
            <div className="mt-10 flex flex-wrap gap-3 text-sm">
              <Link
                href="/inquiries"
                className="press inline-flex items-center h-11 px-5 bg-ink text-cream hover:bg-ink-soft transition-colors"
              >
                Start a residential inquiry →
              </Link>
              <Link
                href="/projects"
                className="press inline-flex items-center h-11 px-5 text-mute hover:text-ink transition-colors"
              >
                See completed houses
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
                  Houses that learn from their site.
                </h2>
              </Reveal>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <Reveal delay={0.08}>
                <div className="space-y-5 text-body-lg leading-relaxed max-w-[58ch]">
                  <p>
                    The Malabar coast is not a neutral place to build. Eight
                    months of strong light, four months of monsoon, ground
                    that is often laterite, plots that are rarely flat. A
                    house here is a conversation with weather before it is
                    anything else.
                  </p>
                  <p>
                    Our residential work begins on site. We measure the
                    light, the slope, the prevailing wind, the trees worth
                    keeping, the neighbour&apos;s wall that&apos;s already
                    deciding part of your plan. The drawing follows. Plans
                    are arranged around courtyards where they earn one,
                    verandahs where they shade the right rooms, openings
                    sized for cross-ventilation before air conditioning.
                  </p>
                  <p>
                    Materials are local where possible — laterite, country
                    wood, lime plaster, oxide floors — chosen because they
                    age well in this climate, not because they look heritage.
                    The detail register is quiet. Every joint is drawn twice
                    before it leaves the studio.
                  </p>
                  <p>
                    Each house is led personally by one of the three
                    founding partners, from the first conversation to the
                    last site visit. We don&apos;t hand projects off to
                    juniors after the contract is signed.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      <ProcessTimeline
        eyebrow="How a house gets built"
        headline="Six phases. One unhurried arc."
      />

      <section className="py-20 md:py-28 border-b border-hairline">
        <Container>
          <Reveal>
            <span className="eyebrow">Houses, recent</span>
            <h2 className="mt-6 font-serif text-headline max-w-[20ch]">
              Recent residential work, across Kerala.
            </h2>
          </Reveal>
          <ul className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
            {FEATURED_HOUSES.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 2) * 0.06}>
                <li className="border-t border-hairline pt-6">
                  <h3 className="font-serif text-2xl md:text-3xl tracking-tight">
                    <Link
                      href={`/projects/${p.slug}`}
                      className="press hover:text-mute transition-colors"
                    >
                      {p.name}
                      <span aria-hidden="true" className="ml-2 text-mute">
                        →
                      </span>
                    </Link>
                  </h3>
                  <p className="mt-3 text-body-lg text-mute max-w-[42ch]">
                    {p.blurb}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-20 md:py-28 border-b border-hairline">
        <Container>
          <div className="md:grid md:grid-cols-12 md:gap-12">
            <div className="md:col-span-4">
              <Reveal>
                <span className="eyebrow">FAQ</span>
                <h2 className="mt-6 font-serif text-headline tracking-tight max-w-[16ch]">
                  Working with a residential architect in Calicut.
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

      <InquiryCta
        eyebrow="Start a house"
        headline="Have a site in mind?"
        subhead="Tell us where, when, and what you'd like to make there."
        ctaLabel="Start a residential inquiry"
      />
    </>
  );
}
