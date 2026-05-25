import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { InquiryForm } from "@/components/site/InquiryForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { STUDIO_EMAIL, STUDIO_PHONES } from "@/lib/contact";
import { absoluteUrl, breadcrumbsJsonLd, ORG_ID } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute: "Contact SOHO Architects — Calicut, Kerala",
  },
  description:
    "Speak with SOHO Architects, an architecture and interior design firm in Calicut (Kozhikode), Kerala. Reply within three working days, always from a person.",
  alternates: { canonical: "/inquiries" },
  openGraph: {
    title: "Contact — SOHO Architects, Calicut",
    description:
      "Tell us about your site, your timing, and what you'd like to make. Architects in Calicut (Kozhikode), Kerala.",
    url: "/inquiries",
  },
};

export default function InquiriesPage() {
  const breadcrumbs = breadcrumbsJsonLd([
    { name: "Home", path: "/" },
    { name: "Contact", path: "/inquiries" },
  ]);

  const contactPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact SOHO Architects — Calicut, Kerala",
    url: absoluteUrl("/inquiries"),
    mainEntity: { "@id": ORG_ID },
  };

  const mapEmbedUrl = process.env.NEXT_PUBLIC_GBP_EMBED_URL;

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={contactPageJsonLd} />
      <section className="pt-32 md:pt-44 pb-16 md:pb-20 border-b border-hairline">
        <Container>
          <Reveal>
            <span className="eyebrow">Inquiries</span>
            <h1 className="mt-6 font-serif text-headline max-w-[18ch]">
              Tell us about your site, and what you'd like to make there.
            </h1>
            <p className="mt-6 max-w-xl text-body-lg text-mute">
              A few words about the place, the timing, and what you&apos;re
              imagining helps us reply with care. Required fields are marked *.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="md:grid md:grid-cols-12 md:gap-12">
            <aside className="md:col-span-4 mb-12 md:mb-0">
              <Reveal>
                <span className="eyebrow">Studio</span>
                <address className="mt-5 not-italic text-base leading-relaxed">
                  SOHO Architects
                  <br />
                  Golf Link Road, Malaparamba
                  <br />
                  Kozhikode, Kerala 673009
                </address>
                <ul className="mt-4 space-y-1 text-base">
                  {STUDIO_PHONES.map((p) => (
                    <li key={p.tel}>
                      <a
                        href={`tel:${p.tel}`}
                        data-event="phone_click"
                        data-event-source="inquiries_aside"
                        data-event-value={p.tel}
                        className="press underline decoration-1 underline-offset-4 hover:text-mute transition-colors tabular-nums"
                      >
                        {p.display}
                      </a>
                    </li>
                  ))}
                </ul>
                <dl className="mt-8 space-y-5 text-sm">
                  <div>
                    <dt className="eyebrow">Email</dt>
                    <dd className="mt-1.5">
                      <a
                        href={`mailto:${STUDIO_EMAIL}`}
                        data-event="email_click"
                        data-event-source="inquiries_aside"
                        className="underline decoration-1 underline-offset-4 hover:text-mute transition-colors"
                      >
                        {STUDIO_EMAIL}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="eyebrow">Hours</dt>
                    <dd className="mt-1.5 text-mute">
                      Monday to Friday · 10:00 to 18:00 IST
                    </dd>
                    <dd className="mt-1 text-mute">
                      Site visits on Saturdays, by appointment.
                    </dd>
                  </div>
                </dl>
              </Reveal>
            </aside>

            <div className="md:col-span-8">
              <Reveal delay={0.08}>
                <InquiryForm />
              </Reveal>
            </div>
          </div>

          {mapEmbedUrl && (
            <Reveal>
              <div className="mt-16 md:mt-24 border-t border-hairline pt-12">
                <span className="eyebrow">The studio · Malaparamba, Calicut</span>
                <div className="mt-6 aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden bg-surface border border-hairline">
                  <iframe
                    src={mapEmbedUrl}
                    title="SOHO Architects studio location — Malaparamba, Kozhikode"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full block"
                    allowFullScreen
                  />
                </div>
              </div>
            </Reveal>
          )}
        </Container>
      </section>
    </>
  );
}
