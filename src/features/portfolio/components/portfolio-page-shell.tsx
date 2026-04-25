import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PortfolioPageShellProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function PortfolioPageShell({
  children,
  className,
  contentClassName,
}: PortfolioPageShellProps) {
  return (
    <main className={cn("relative overflow-hidden", className)}>
      <div
        className={cn(
          "mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-16 pt-6 sm:px-8 lg:px-10",
          contentClassName,
        )}
      >
        {children}
      </div>
    </main>
  );
}
