import type { ReactNode } from "react";
import { GlassPanel } from "./glass-panel";
import { PortfolioBrandLink } from "./portfolio-brand-link";

interface PortfolioHeaderProps {
  actions?: ReactNode;
}

export function PortfolioHeader({ actions }: PortfolioHeaderProps) {
  return (
    <GlassPanel
      as="header"
      className="flex flex-col gap-4 rounded-full px-5 py-4 shadow-[0_16px_50px_-40px_rgba(15,23,42,0.35)] sm:flex-row sm:items-center sm:justify-between"
    >
      <PortfolioBrandLink />
      {actions ? (
        <div className="flex flex-wrap items-center gap-3">{actions}</div>
      ) : null}
    </GlassPanel>
  );
}
