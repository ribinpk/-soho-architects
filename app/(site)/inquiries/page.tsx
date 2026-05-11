import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { InquiryForm } from "@/components/site/InquiryForm";

export const metadata: Metadata = {
  title: "Inquiries",
  description:
    "Start a conversation with SOHO Architects. Tell us about your site, your timeline, and what you'd like to make.",
};

export default function InquiriesPage() {
  return (
    <>
      <section className="pt-32 md:pt-44 pb-16 md:pb-20 border-b border-hairline">
        <Container>
          <Reveal>
            <span className="eyebrow">Inquiries</span>
            <h1 className="mt-6 font-serif text-headline max-w-[18ch]">
              Tell us about your site, and what you'd like to make there.
            </h1>
            <p className="mt-6 max-w-xl text-body-lg text-mute">
              A few words about the project, the location, and your timing helps
              us reply with care. Required fields are marked *.
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
                <dl className="mt-8 space-y-5 text-sm">
                  <div>
                    <dt className="eyebrow">Email</dt>
                    <dd className="mt-1.5">
                      <a
                        href="mailto:studio@sohoarch.com"
                        className="underline decoration-1 underline-offset-4 hover:text-mute transition-colors"
                      >
                        studio@sohoarch.com
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="eyebrow">Hours</dt>
                    <dd className="mt-1.5 text-mute">
                      Mon — Fri · 10:00 to 18:00 IST
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
        </Container>
      </section>
    </>
  );
}
