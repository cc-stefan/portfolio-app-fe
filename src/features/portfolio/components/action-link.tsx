import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ActionLinkProps {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  variant?: "primary" | "secondary";
  external?: boolean;
  className?: string;
}

export function ActionLink({
  href,
  children,
  icon,
  iconPosition = "end",
  variant = "secondary",
  external = false,
  className,
}: ActionLinkProps) {
  const classes = cn(
    "inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition",
    variant === "primary"
      ? "bg-slate-950 text-white hover:bg-slate-800"
      : "border border-black/10 bg-white/80 text-foreground hover:bg-white",
    className,
  );

  const content = (
    <>
      {iconPosition === "start" ? icon : null}
      {children}
      {iconPosition === "end" ? icon : null}
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
