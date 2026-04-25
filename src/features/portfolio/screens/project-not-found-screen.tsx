import { ArrowLeft } from "lucide-react";
import { ActionLink } from "../components/action-link";
import { GlassPanel } from "../components/glass-panel";
import { PortfolioPageShell } from "../components/portfolio-page-shell";

export function PortfolioProjectNotFoundScreen() {
  return (
    <PortfolioPageShell contentClassName="max-w-5xl items-center justify-center py-16">
      <GlassPanel
        as="section"
        className="w-full rounded-[2.5rem] p-8 sm:p-12"
      >
        <p className="text-xs font-medium uppercase tracking-[0.32em] text-foreground/45">
          404 / Not found
        </p>
        <h1 className="mt-5 max-w-3xl text-balance text-5xl font-semibold tracking-[-0.06em] text-foreground sm:text-6xl">
          That project is not available in the portfolio API.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
          The slug may be wrong, the project may still be a draft, or the
          backend may not have data for it yet.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ActionLink
            href="/"
            variant="primary"
            icon={<ArrowLeft className="size-4" />}
            iconPosition="start"
          >
            Back to portfolio
          </ActionLink>
        </div>
      </GlassPanel>
    </PortfolioPageShell>
  );
}
