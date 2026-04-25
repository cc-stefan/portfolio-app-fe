import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type GlassPanelProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function GlassPanel<T extends ElementType = "div">({
  as,
  children,
  className,
  ...props
}: GlassPanelProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={cn(
        "border border-black/10 bg-white/72 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.42)] backdrop-blur-sm",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
