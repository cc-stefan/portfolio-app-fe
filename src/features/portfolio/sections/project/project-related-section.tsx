import type { PortfolioProject } from "../../model/types";
import { ProjectCard } from "../../components/project-card";

interface ProjectRelatedSectionProps {
  relatedProjects: PortfolioProject[];
}

export function ProjectRelatedSection({
  relatedProjects,
}: ProjectRelatedSectionProps) {
  if (relatedProjects.length === 0) {
    return null;
  }

  return (
    <section className="pt-14">
      <div className="max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.32em] text-foreground/45">
          More work
        </p>
        <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
          Other published projects
        </h2>
      </div>

      <div className="mt-10 grid gap-6 xl:grid-cols-3">
        {relatedProjects.map((relatedProject, index) => (
          <ProjectCard
            key={relatedProject.id}
            project={relatedProject}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
