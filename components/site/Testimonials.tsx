import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export type Testimonial = {
  quote: string;
  author: string;
  role?: string;
  project?: string;
};

const DEFAULTS: Testimonial[] = [
  {
    quote:
      "Working with SOHO is rare — they read the land before they reach for the pencil. The home they built for us feels like it was always meant to stand there.",
    author: "A. Menon",
    role: "Homeowner",
    project: "Hillside Residence, Wayanad",
  },
  {
    quote:
      "Calm, considered, and uncompromising on craft. Every detail was thought through twice, and it shows in the daylight.",
    author: "R. Krishnan",
    role: "Founding partner",
    project: "Workspace · Bengaluru",
  },
  {
    quote:
      "They listened more than they talked. By the time they presented, the design already felt like ours.",
    author: "S. & V. Pillai",
    role: "Homeowners",
    project: "Courtyard House, Kozhikode",
  },
];

type Props = {
  eyebrow?: string;
  testimonials?: Testimonial[];
};

export function Testimonials({
  eyebrow = "In their words",
  testimonials,
}: Props) {
  const items = testimonials && testimonials.length > 0 ? testimonials : DEFAULTS;

  return (
    <section className="py-20 md:py-32 border-b border-hairline">
      <Container>
        <Reveal>
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-x-8 lg:gap-x-12 gap-y-14">
          {items.map((t, i) => (
            <Reveal key={`${t.author}-${i}`} delay={(i % 3) * 0.08}>
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
      </Container>
    </section>
  );
}
