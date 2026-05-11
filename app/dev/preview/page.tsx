import { Container } from "@/components/ui/Container";

const COLORS = [
  { name: "Cream", hex: "#F5F1EA", class: "bg-cream", role: "Page surface" },
  { name: "Paper", hex: "#FAF7F1", class: "bg-paper", role: "Elevated surface" },
  { name: "Surface", hex: "#ECE5D6", class: "bg-surface", role: "Panel / card" },
  { name: "Hairline", hex: "#E0D9CC", class: "bg-hairline", role: "Borders / dividers" },
  { name: "Ink", hex: "#1A1A1A", class: "bg-ink", role: "Primary text / inverse surface" },
  { name: "Ink Soft", hex: "#2A2826", class: "bg-ink-soft", role: "Header / dense type" },
  { name: "Mute", hex: "#6B6863", class: "bg-mute", role: "Secondary text" },
  { name: "Mute Soft", hex: "#8C8881", class: "bg-mute-soft", role: "Tertiary text" },
];

const TYPE_SAMPLES = [
  { token: "text-display", label: "Display", sample: "Architecture rooted in place." },
  { token: "text-headline", label: "Headline", sample: "Houses, offices, and quiet rooms." },
  { token: "text-title", label: "Title", sample: "A studio in Kozhikode." },
  { token: "text-subtitle", label: "Subtitle", sample: "Working across residential and workspace." },
  { token: "text-body-lg", label: "Body L", sample: "We design buildings that respond to climate, terrain, and the way people gather. Each project is shaped by the site that holds it." },
  { token: "text-base", label: "Body", sample: "We design buildings that respond to climate, terrain, and the way people gather. Each project is shaped by the site that holds it." },
];

export default function PreviewPage() {
  return (
    <div className="bg-cream text-ink min-h-screen">
      <Container className="py-16 md:py-24">
        <div className="mb-16">
          <span className="eyebrow">Phase 1 · Sign-off</span>
          <h1 className="mt-4 font-serif text-headline">Visual System</h1>
          <p className="mt-4 max-w-2xl text-body-lg text-mute">
            Tokens, type, color, and component primitives. Review and approve,
            then page work begins.
          </p>
        </div>

        {/* Type pairing */}
        <Section title="Type pairing" eyebrow="01">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
            <div className="border border-hairline p-6 md:p-8">
              <p className="eyebrow">Display · Serif</p>
              <p className="mt-3 font-serif text-5xl md:text-6xl leading-none tracking-tight">
                Fraunces
              </p>
              <p className="mt-3 text-sm text-mute">
                Variable serif. Display + editorial headings.
              </p>
            </div>
            <div className="border border-hairline p-6 md:p-8">
              <p className="eyebrow">Body · Sans</p>
              <p className="mt-3 font-sans text-5xl md:text-6xl leading-none tracking-tight">
                Inter
              </p>
              <p className="mt-3 text-sm text-mute">
                Clean grotesque. UI, body, and labels.
              </p>
            </div>
          </div>
        </Section>

        {/* Type ramp */}
        <Section title="Type ramp" eyebrow="02">
          <div className="border-t border-hairline">
            {TYPE_SAMPLES.map((row) => (
              <div
                key={row.token}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 py-6 md:py-8 border-b border-hairline"
              >
                <div className="md:col-span-3">
                  <p className="eyebrow">{row.label}</p>
                  <p className="mt-1 font-mono text-xs text-mute-soft">
                    {row.token}
                  </p>
                </div>
                <p
                  className={`md:col-span-9 ${row.token} ${row.token === "text-base" || row.token === "text-body-lg" ? "font-sans" : "font-serif"}`}
                >
                  {row.sample}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Eyebrow */}
        <Section title="Eyebrow & meta" eyebrow="03">
          <div className="border border-hairline p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <span className="eyebrow">Eyebrow label</span>
              <p className="mt-2 font-mono text-xs text-mute-soft">.eyebrow</p>
            </div>
            <div>
              <span className="eyebrow">Project 04 · 2024</span>
              <p className="mt-2 font-mono text-xs text-mute-soft">
                Project meta
              </p>
            </div>
            <div>
              <span className="eyebrow">Kannur, Kerala</span>
              <p className="mt-2 font-mono text-xs text-mute-soft">Location</p>
            </div>
          </div>
        </Section>

        {/* Color */}
        <Section title="Color" eyebrow="04">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {COLORS.map((c) => (
              <div
                key={c.name}
                className="border border-hairline overflow-hidden"
              >
                <div className={`${c.class} aspect-[5/3]`} />
                <div className="p-4">
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="mt-0.5 font-mono text-xs text-mute">{c.hex}</p>
                  <p className="mt-2 text-xs text-mute-soft">{c.role}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Buttons */}
        <Section title="Buttons" eyebrow="05">
          <div className="border border-hairline p-8 flex flex-wrap items-center gap-4">
            <button className="inline-flex items-center h-11 px-6 bg-ink text-cream text-sm tracking-wide hover:bg-ink-soft transition-colors">
              Primary action
            </button>
            <button className="inline-flex items-center h-11 px-6 border border-ink text-ink text-sm tracking-wide hover:bg-ink hover:text-cream transition-colors">
              Outline action
            </button>
            <button className="inline-flex items-center h-11 px-2 text-ink text-sm tracking-wide hover:text-mute transition-colors underline decoration-1 underline-offset-4">
              Link action
            </button>
            <button
              disabled
              className="inline-flex items-center h-11 px-6 bg-mute-soft text-cream text-sm tracking-wide cursor-not-allowed"
            >
              Disabled
            </button>
          </div>
        </Section>

        {/* Form */}
        <Section title="Form controls" eyebrow="06">
          <div className="border border-hairline p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <Field label="Name" placeholder="Full name" />
            <Field label="Email" placeholder="you@studio.com" type="email" />
            <Field label="Location" placeholder="City, country" />
            <Field label="Budget range (optional)" placeholder="–" />
            <div className="md:col-span-2">
              <label className="block">
                <span className="eyebrow">Message</span>
                <textarea
                  rows={5}
                  placeholder="Tell us about the project, site, and timing."
                  className="mt-2 w-full bg-paper border border-hairline px-4 py-3 text-sm focus:border-ink focus:outline-none transition-colors resize-y"
                />
              </label>
            </div>
          </div>
        </Section>

        {/* Image treatments */}
        <Section title="Image treatments" eyebrow="07">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Ratio label="3 : 4 portrait" ratio="aspect-[3/4]" />
            <Ratio label="4 : 5 editorial" ratio="aspect-[4/5]" />
            <Ratio label="16 : 10 landscape" ratio="aspect-[16/10]" />
          </div>
        </Section>

        {/* Spacing */}
        <Section title="Spacing scale" eyebrow="08">
          <div className="border border-hairline p-8 space-y-3">
            {[4, 6, 8, 12, 16, 24, 32].map((n) => (
              <div key={n} className="flex items-center gap-6">
                <span className="w-16 font-mono text-xs text-mute">
                  {n * 0.25}rem
                </span>
                <div className="bg-ink h-2" style={{ width: `${n * 0.25}rem` }} />
                <span className="text-xs text-mute-soft">p-{n} / gap-{n}</span>
              </div>
            ))}
          </div>
        </Section>
      </Container>
    </div>
  );
}

function Section({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-20 md:mb-28">
      <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-hairline">
        <h2 className="font-serif text-title">{title}</h2>
        <span className="eyebrow">{eyebrow}</span>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  type = "text",
  placeholder,
}: {
  label: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full bg-paper border border-hairline h-11 px-4 text-sm focus:border-ink focus:outline-none transition-colors"
      />
    </label>
  );
}

function Ratio({ label, ratio }: { label: string; ratio: string }) {
  return (
    <div>
      <div className={`${ratio} bg-surface border border-hairline`} />
      <p className="mt-2 text-xs text-mute">{label}</p>
    </div>
  );
}
