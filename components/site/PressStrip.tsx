import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SanityImage } from "@/components/sanity/SanityImage";
import type { PressLogo } from "@/lib/types";

const DEFAULTS: PressLogo[] = [
  { name: "Architectural Digest India" },
  { name: "Elle Decor" },
  { name: "Beautiful Homes" },
  { name: "Mint Lounge" },
  { name: "The Hindu" },
];

type Props = {
  eyebrow?: string;
  logos?: PressLogo[];
};

export function PressStrip({
  eyebrow = "Featured in",
  logos,
}: Props) {
  const items = logos && logos.length > 0 ? logos : DEFAULTS;

  return (
    <section className="py-14 md:py-16 border-b border-hairline">
      <Container>
        <Reveal>
          <div className="flex items-center justify-center">
            <span className="eyebrow !text-mute">{eyebrow}</span>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <ul className="mt-8 md:mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-8 items-center justify-items-center">
            {items.map((item) => (
              <li
                key={item.name}
                className="flex items-center justify-center w-full"
              >
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="press inline-flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
                    aria-label={`${item.name} — opens in a new tab`}
                  >
                    <LogoOrName item={item} />
                  </a>
                ) : (
                  <span className="inline-flex items-center justify-center opacity-70">
                    <LogoOrName item={item} />
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}

function LogoOrName({ item }: { item: PressLogo }) {
  if (item.logo?.asset) {
    return (
      <span className="relative block h-7 md:h-8 w-auto">
        <SanityImage
          image={item.logo}
          alt={item.name}
          height={64}
          sizes="(max-width: 768px) 40vw, 160px"
          className="logo-image h-7 md:h-8 w-auto object-contain"
        />
      </span>
    );
  }
  return (
    <span className="font-serif italic text-lg md:text-xl tracking-tight text-ink whitespace-nowrap">
      {item.name}
    </span>
  );
}
