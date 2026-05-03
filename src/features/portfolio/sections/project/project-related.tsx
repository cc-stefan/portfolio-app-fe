import { SectionIntro } from "../../components/section-intro";
import { ProjectCard } from "../../components/project-card";
import type { AppLocale } from "../../i18n/routing";
import type { PortfolioDictionary } from "../../i18n/types";
import type { PortfolioProject } from "../../model/types";

interface ProjectRelatedProps {
  locale: AppLocale;
  dictionary: PortfolioDictionary;
  relatedProjects: PortfolioProject[];
  apiOrigin: string;
}

export function ProjectRelated({
  locale,
  dictionary,
  relatedProjects,
  apiOrigin,
}: ProjectRelatedProps) {
  if (relatedProjects.length === 0) {
    return null;
  }

  return (
    <section>
      <SectionIntro
        label={dictionary.project.relatedLabel}
        title={dictionary.project.relatedTitle}
        description={dictionary.project.relatedDescription}
      />
      <div className="stagger-list mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {relatedProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            locale={locale}
            dictionary={dictionary}
            apiOrigin={apiOrigin}
          />
        ))}
      </div>
    </section>
  );
}
