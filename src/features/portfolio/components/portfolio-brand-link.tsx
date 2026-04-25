import Link from "next/link";

interface PortfolioBrandLinkProps {
  href?: string;
}

export function PortfolioBrandLink({
  href = "/",
}: PortfolioBrandLinkProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.28em] text-foreground/80"
    >
      <span className="flex size-9 items-center justify-center rounded-full bg-slate-950 text-[11px] font-bold text-white">
        PA
      </span>
      portfolio frontend
    </Link>
  );
}
