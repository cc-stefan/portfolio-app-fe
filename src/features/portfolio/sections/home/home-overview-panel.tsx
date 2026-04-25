import { formatProjectMonth } from "../../model/formatters";
import type { PortfolioProject } from "../../model/types";
import { GlassPanel } from "../../components/glass-panel";
import { ProjectPreviewList } from "../../components/project-preview-list";
import { StatCard } from "../../components/stat-card";

interface HomeOverviewPanelProps {
  projects: PortfolioProject[];
  featuredProjects: PortfolioProject[];
  technologies: string[];
  latestProject: PortfolioProject | null;
  apiBaseUrl: string;
}

export function HomeOverviewPanel({
  projects,
  featuredProjects,
  technologies,
  latestProject,
  apiBaseUrl,
}: HomeOverviewPanelProps) {
  return (
    <GlassPanel
      as="aside"
      className="relative overflow-hidden rounded-[2.25rem] p-6 shadow-[0_24px_90px_-52px_rgba(15,23,42,0.45)]"
    >
      <div className="absolute right-[-3rem] top-[-3rem] size-32 rounded-full bg-[color:var(--accent)]/20 blur-3xl" />
      <p className="relative text-xs font-medium uppercase tracking-[0.28em] text-foreground/45">
        System overview
      </p>

      <div className="relative mt-6 grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Published"
          value={projects.length.toString().padStart(2, "0")}
        />
        <StatCard
          label="Featured"
          value={featuredProjects.length.toString().padStart(2, "0")}
        />
        <StatCard
          label="Stack tags"
          value={technologies.length.toString().padStart(2, "0")}
        />
        <div className="rounded-[1.5rem] border border-black/8 bg-white/80 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-foreground/45">
            Last update
          </p>
          <p className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-foreground">
            {latestProject ? formatProjectMonth(latestProject.updatedAt) : "--"}
          </p>
        </div>
      </div>

      <div className="relative mt-6 rounded-[1.75rem] border border-black/8 bg-black/4 p-5">
        <p className="text-xs uppercase tracking-[0.24em] text-foreground/45">
          API source
        </p>
        <p className="mt-3 break-all font-mono text-sm text-foreground/80">
          {apiBaseUrl}
        </p>
        <div className="mt-5">
          <ProjectPreviewList
            projects={projects.slice(0, 3)}
            emptyMessage="Publish the first project in the backend admin routes and it will appear here automatically."
          />
        </div>
      </div>
    </GlassPanel>
  );
}
