import { SectionIntro } from '../../components/section-intro';
import { ProjectCard } from '../../components/project-card';
import type { AppLocale } from '../../i18n/routing';
import type { PortfolioDictionary } from '../../i18n/types';
import type { PortfolioProject } from '../../model/types';

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
      <div className="stagger-list mt-8 grid gap-6 lg:grid-cols-2">
        {relatedProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            locale={locale}
            copy={{
              featured: dictionary.common.featured,
              noTechnologies: dictionary.common.noTechnologies,
              viewProject: dictionary.actions.viewProject,
              live: dictionary.actions.live,
              code: dictionary.actions.code,
            }}
            apiOrigin={apiOrigin}
          />
        ))}
      </div>
    </section>
  );
}
