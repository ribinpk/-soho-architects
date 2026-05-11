import Link from "next/link";
import { Container } from "@/components/ui/Container";

export const metadata = {
  title: "Not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Container className="py-32 md:py-48 text-center">
      <span className="eyebrow">404</span>
      <h1 className="mt-6 font-serif text-display">Page not found.</h1>
      <p className="mt-6 text-mute max-w-sm mx-auto">
        The link may be broken, or the page may have moved.
      </p>
      <div className="mt-10 flex justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center h-11 px-6 border border-ink hover:bg-ink hover:text-cream transition-colors text-sm"
        >
          Return home
        </Link>
        <Link
          href="/projects"
          className="inline-flex items-center h-11 px-6 text-mute hover:text-ink transition-colors text-sm"
        >
          View projects →
        </Link>
      </div>
    </Container>
  );
}
