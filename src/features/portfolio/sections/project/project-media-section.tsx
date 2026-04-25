import type { PortfolioProject } from "../../model/types";
import { GlassPanel } from "../../components/glass-panel";
import { ProjectVisual } from "../../components/project-visual";
import { TechnologyCloud } from "../../components/technology-cloud";

interface ProjectMediaSectionProps {
  project: PortfolioProject;
}

export function ProjectMediaSection({ project }: ProjectMediaSectionProps) {
  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[2.25rem] border border-black/10 bg-black/5 shadow-[0_30px_100px_-56px_rgba(15,23,42,0.55)]">
        <ProjectVisual project={project} className="h-full w-full" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02),rgba(15,23,42,0.22))]" />
      </div>

      <GlassPanel
        as="aside"
        className="rounded-[2rem] p-6"
      >
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-foreground/45">
          Tech stack
        </p>
        <TechnologyCloud
          technologies={project.technologies}
          className="mt-5"
          size="sm"
        />

        <div className="mt-8 rounded-[1.75rem] bg-black/5 p-5 text-sm leading-7 text-muted-foreground">
          This page renders from <code>GET /api/projects/:slug</code> and stays
          aligned with the backend data model instead of a duplicated frontend
          content file.
        </div>
      </GlassPanel>
    </section>
  );
}
