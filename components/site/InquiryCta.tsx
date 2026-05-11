import Link from "next/link";
import { Container } from "@/components/ui/Container";

type Props = {
  eyebrow?: string;
  headline?: string;
  ctaLabel?: string;
};

export function InquiryCta({
  eyebrow = "New work",
  headline = "Have a project in mind?",
  ctaLabel = "Start an inquiry",
}: Props) {
  return (
    <section className="py-20 md:py-32">
      <Container className="text-center">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="mt-6 font-serif text-headline max-w-[18ch] mx-auto">
          {headline}
        </h2>
        <Link
          href="/inquiries"
          className="mt-10 inline-flex items-center h-12 px-7 bg-ink text-cream text-sm tracking-wide hover:bg-ink-soft transition-colors"
        >
          {ctaLabel}
          <span aria-hidden="true" className="ml-3">
            →
          </span>
        </Link>
      </Container>
    </section>
  );
}
