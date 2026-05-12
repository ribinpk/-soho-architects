import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export type Testimonial = {
  quote: string;
  author: string;
  role?: string;
  project?: string;
};

type Props = {
  eyebrow?: string;
  testimonials?: Testimonial[];
};

export function Testimonials({
  eyebrow = "From the studio",
  testimonials,
}: Props) {
  // No real, signed testimonials yet — the studio's own voice carries the
  // section. When 1–2 real testimonials arrive via Sanity, they render
  // beneath the statement.
  const items = testimonials && testimonials.length > 0 ? testimonials.slice(0, 2) : [];

  return (
    <section className="py-20 md:py-32 border-b border-hairline">
      <Container>
        <Reveal>
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>

        <div className="mt-10 md:mt-14 md:grid md:grid-cols-12 md:gap-12">
          <div className="md:col-span-8 md:col-start-3">
            <Reveal delay={0.06}>
              <p className="font-serif text-title tracking-tight leading-tight text-ink">
                We design slowly. We visit the site more than is reasonable.
                We draw by hand when the building asks for it, and we stay
                reachable long after the keys change hands. The work is meant
                to last — in material, in usefulness, and in the way it sits
                on its land.
              </p>
              <p className="mt-6 text-sm text-mute">
                — Suhail AK &amp; Varun Gopal, co-founders
              </p>
            </Reveal>
          </div>
        </div>

        {items.length > 0 && (
          <div
            className={`mt-16 md:mt-20 grid grid-cols-1 ${
              items.length === 2 ? "md:grid-cols-2" : "md:grid-cols-1"
            } gap-x-12 gap-y-12 border-t border-hairline pt-14`}
          >
            {items.map((t, i) => (
              <Reveal key={`${t.author}-${i}`} delay={i * 0.08}>
                <figure className="flex flex-col h-full">
                  <span
                    aria-hidden="true"
                    className="font-serif text-display leading-none text-ink-soft/40 select-none"
                  >
                    &ldquo;
                  </span>
                  <blockquote className="mt-2 font-serif text-xl md:text-2xl tracking-tight leading-snug text-ink">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-6 pt-5 border-t border-hairline text-sm">
                    <div className="text-ink">{t.author}</div>
                    {(t.role || t.project) && (
                      <div className="mt-1 text-mute">
                        {[t.role, t.project].filter(Boolean).join(" · ")}
                      </div>
                    )}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
