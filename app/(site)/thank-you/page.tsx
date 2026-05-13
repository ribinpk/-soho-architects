import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: {
    absolute: "Inquiry received | SOHO Architects",
  },
  description:
    "Thanks — we’ve received your inquiry. We reply within three working days, always from a person.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/thank-you" },
};

export default function ThankYouPage() {
  return (
    <Container className="py-32 md:py-48 text-center">
      <Reveal>
        <span className="eyebrow">Inquiry received</span>
        <h1 className="mt-6 font-serif text-display max-w-[18ch] mx-auto">
          Thank you. We’ll be in touch.
        </h1>
        <p className="mt-6 text-body-lg text-mute max-w-md mx-auto">
          A real person at the studio will reply within three working days.
          If it’s urgent, please call us.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3 text-sm">
          <Link
            href="/projects"
            className="press inline-flex items-center h-11 px-5 border border-ink hover:bg-ink hover:text-cream transition-colors"
          >
            See our projects
          </Link>
          <Link
            href="/studio"
            className="press inline-flex items-center h-11 px-5 text-mute hover:text-ink transition-colors"
          >
            About the studio →
          </Link>
        </div>
      </Reveal>
    </Container>
  );
}
