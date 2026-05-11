import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  /**
   * When true, renders the smaller "icon-only" mark. Currently same wordmark,
   * but separating intent so the SVG can replace it later.
   */
  compact?: boolean;
};

export function Logo({ className, compact = false }: LogoProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "font-serif leading-none tracking-tight",
        compact ? "text-lg" : "text-xl md:text-2xl",
        className,
      )}
    >
      SOHO
      <span className="text-mute"> Architects</span>
    </span>
  );
}
