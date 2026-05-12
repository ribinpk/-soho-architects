import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  /** Smaller variant used in the scrolled header state. */
  compact?: boolean;
};

export function Logo({ className, compact = false }: LogoProps) {
  return (
    <Image
      src="/brand/logo.png"
      alt="SOHO Architects"
      width={2480}
      height={1276}
      priority
      className={cn(
        "logo-image w-auto select-none transition-[height,filter] duration-300 ease-[var(--ease-soft)]",
        compact ? "h-12 md:h-14" : "h-16 md:h-[4.5rem]",
        className,
      )}
    />
  );
}
