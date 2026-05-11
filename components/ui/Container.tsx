import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContainerProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function Container<T extends ElementType = "div">({
  as,
  children,
  className,
  ...rest
}: ContainerProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-[1440px] px-5 sm:px-8 md:px-12 lg:px-16",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
