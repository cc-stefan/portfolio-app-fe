import { ArrowRight } from "lucide-react";
import { ActionLink } from "../../components/action-link";
import type { ApiResult, PortfolioProject } from "../../model/types";

interface HomeHeroSectionProps {
  latestProject: PortfolioProject | null;
  projectsResult: ApiResult<PortfolioProject[]>;
}

export function HomeHeroSection({
  latestProject,
  projectsResult,
}: HomeHeroSectionProps) {
  return (
    <section>
      <p className="text-xs font-medium uppercase tracking-[0.34em] text-foreground/45">
        Next 16 frontend / NestJS backend
      </p>
      <h1 className="mt-6 max-w-5xl text-balance text-5xl font-semibold tracking-[-0.07em] text-foreground sm:text-6xl lg:text-8xl">
        Interfaces that feel editorial, structured, and API-backed.
      </h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">
        The frontend now reads published portfolio work directly from{" "}
        <code>portfolio-app-be</code>, so project cards, detail pages, and
        metadata all come from the same backend source.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <ActionLink
          href="#featured"
          variant="primary"
          icon={<ArrowRight className="size-4" />}
        >
          Browse featured work
        </ActionLink>
        <ActionLink
          href={latestProject ? `/projects/${latestProject.slug}` : "#stack"}
          icon={<ArrowRight className="size-4" />}
        >
          {latestProject ? "Open latest case study" : "See stack coverage"}
        </ActionLink>
      </div>

      {!projectsResult.ok ? (
        <div className="mt-8 max-w-3xl rounded-[2rem] border border-amber-600/20 bg-amber-100/65 p-5 text-sm leading-7 text-amber-950/85">
          {projectsResult.error} Start <code>portfolio-app-be</code> with{" "}
          <code>pnpm start:dev</code> or point{" "}
          <code>PORTFOLIO_API_BASE_URL</code> at the correct backend.
        </div>
      ) : null}
    </section>
  );
}
