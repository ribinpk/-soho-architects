import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Magnetic } from "@/components/ui/Magnetic";

type Props = {
  eyebrow?: string;
  headline?: string;
  subhead?: string;
  ctaLabel?: string;
};

export function InquiryCta({
  eyebrow = "New work",
  headline = "Have a project in mind?",
  subhead = "Tell us about your site.",
  ctaLabel = "Start an inquiry",
}: Props) {
  return (
    <section className="py-20 md:py-32">
      <Container className="text-center">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="mt-6 font-serif text-headline max-w-[18ch] mx-auto">
          {headline}
        </h2>
        {subhead && (
          <p className="mt-5 text-body-lg text-mute max-w-[34ch] mx-auto">
            {subhead}
          </p>
        )}
        <Magnetic className="mt-10 inline-block">
          <Link
            href="/inquiries"
            className="press inline-flex items-center h-12 px-7 bg-ink text-cream text-sm tracking-wide hover:bg-ink-soft transition-colors"
          >
            {ctaLabel}
            <span aria-hidden="true" className="ml-3">
              →
            </span>
          </Link>
        </Magnetic>
      </Container>
    </section>
  );
}
