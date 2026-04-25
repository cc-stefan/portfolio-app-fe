import { formatProjectDate } from "../../model/formatters";
import type { PortfolioProject } from "../../model/types";
import { GlassPanel } from "../../components/glass-panel";
import { ProjectActionLinks } from "../../components/project-action-links";

interface ProjectHeroSectionProps {
  project: PortfolioProject;
}

const factItems = (project: PortfolioProject) => [
  {
    label: "Last updated",
    value: formatProjectDate(project.updatedAt),
  },
  {
    label: "Visibility",
    value: project.published ? "Public" : "Draft",
  },
  {
    label: "Featured",
    value: project.featured ? "Yes" : "No",
  },
  {
    label: "Display order",
    value: String(project.displayOrder),
  },
];

export function ProjectHeroSection({ project }: ProjectHeroSectionProps) {
  return (
    <section className="grid gap-10 pb-10 pt-16 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.32em] text-foreground/45">
          Project / {project.slug}
        </p>
        <h1 className="mt-5 max-w-4xl text-balance text-5xl font-semibold tracking-[-0.06em] text-foreground sm:text-6xl lg:text-7xl">
          {project.title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">
          {project.summary}
        </p>
        <ProjectActionLinks
          project={project}
          className="mt-8 flex flex-wrap gap-3"
        />
      </div>

      <GlassPanel
        as="aside"
        className="rounded-[2rem] p-6"
      >
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-foreground/45">
          Project facts
        </p>
        <dl className="mt-6 space-y-5">
          {factItems(project).map((item) => (
            <div key={item.label}>
              <dt className="text-xs uppercase tracking-[0.22em] text-foreground/45">
                {item.label}
              </dt>
              <dd className="mt-1 text-lg font-semibold tracking-[-0.03em] text-foreground">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </GlassPanel>
    </section>
  );
}
