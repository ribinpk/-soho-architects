import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";

export type Stat = {
  /** Numeric portion. Animates with CountUp when scrolled into view. */
  value: number;
  /** Optional suffix (e.g. "+", "K+", "%"). */
  suffix?: string;
  label: string;
};

type Props = {
  eyebrow?: string;
  stats?: Stat[];
};

const DEFAULTS: Stat[] = [
  { value: 15, label: "Years in practice" },
  { value: 36, label: "Projects delivered" },
  { value: 3, label: "States · India" },
  { value: 1, label: "Studio · Kozhikode" },
];

export function StatsStrip({ eyebrow = "By the numbers", stats = DEFAULTS }: Props) {
  return (
    <section className="py-20 md:py-28 border-b border-hairline">
      <Container>
        <Reveal>
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
        <dl className="mt-10 md:mt-14 grid grid-cols-2 md:grid-cols-4 gap-y-10 md:gap-y-0 md:gap-x-8">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="md:border-l md:border-hairline md:pl-6 first:md:border-l-0 first:md:pl-0">
                <dt className="font-serif text-display tracking-tight leading-none tabular-nums flex items-baseline">
                  <CountUp to={s.value} span={Math.min(s.value, 24)} />
                  {s.suffix && <span aria-hidden="true">{s.suffix}</span>}
                </dt>
                <dd className="mt-3 md:mt-4 eyebrow !text-mute">{s.label}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
