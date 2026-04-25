import type { PortfolioProject } from "../../model/types";
import { ProjectCard } from "../../components/project-card";
import { SectionHeading } from "../../components/section-heading";
import { GlassPanel } from "../../components/glass-panel";

interface HomeProjectsSectionProps {
  id?: string;
  label: string;
  title: string;
  description: string;
  projects: PortfolioProject[];
  featuredCards?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function HomeProjectsSection({
  id,
  label,
  title,
  description,
  projects,
  featuredCards = false,
  emptyTitle = "No published projects are available yet.",
  emptyDescription = "Create a project through the backend admin routes, set published to true, and the frontend will pick it up automatically.",
}: HomeProjectsSectionProps) {
  return (
    <section id={id} className="pb-20">
      <SectionHeading label={label} title={title} description={description} />

      {projects.length > 0 ? (
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              featured={featuredCards}
            />
          ))}
        </div>
      ) : (
        <GlassPanel className="mt-12 rounded-[2.25rem] border-dashed p-8 shadow-[0_24px_90px_-52px_rgba(15,23,42,0.32)] sm:p-10">
          <p className="text-xs font-medium uppercase tracking-[0.32em] text-foreground/45">
            Waiting for content
          </p>
          <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground">
            {emptyTitle}
          </h3>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            {emptyDescription}
          </p>
        </GlassPanel>
      )}
    </section>
  );
}
