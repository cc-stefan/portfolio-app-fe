import { ProjectGridTabs } from '../../components/project-grid-tabs';
import { SectionIntro } from '../../components/section-intro';
import type { AppLocale } from '../../i18n/routing';
import type { PortfolioDictionary } from '../../i18n/types';
import type { PaginationMetadata, PortfolioProject } from '../../model/types';

interface HomeShowcaseProps {
  locale: AppLocale;
  dictionary: PortfolioDictionary;
  projects: PortfolioProject[];
  pagination: PaginationMetadata;
  apiOrigin: string;
}

export function HomeShowcase({
  locale,
  dictionary,
  projects,
  pagination,
  apiOrigin,
}: HomeShowcaseProps) {
  return (
    <section id="projects" className="anchor-target">
      <div className="section-divider" />
      <div className="pt-18 sm:pt-24">
        <SectionIntro
          label={dictionary.home.showcaseLabel}
          title={dictionary.home.showcaseTitle}
          description={dictionary.home.showcaseDescription}
        />
        <ProjectGridTabs
          locale={locale}
          copy={{
            countLabel: dictionary.home.showcaseCountLabel,
            featuredTab: dictionary.home.featuredTab,
            allTab: dictionary.home.allTab,
            carouselLabel: dictionary.home.projectCarouselLabel,
            previousProject: dictionary.home.previousProject,
            nextProject: dictionary.home.nextProject,
            projectPosition: dictionary.home.projectPosition,
            previousPage: dictionary.home.previousProjectsPage,
            nextPage: dictionary.home.nextProjectsPage,
            pagePosition: dictionary.home.projectsPagePosition,
            emptyEyebrow: dictionary.home.showcaseLabel,
            emptyTitle: dictionary.home.emptyTitle,
            emptyDescription: dictionary.home.emptyDescription,
            projectCard: {
              featured: dictionary.common.featured,
              noTechnologies: dictionary.common.noTechnologies,
              viewProject: dictionary.actions.viewProject,
              live: dictionary.actions.live,
              code: dictionary.actions.code,
            },
          }}
          projects={projects}
          pagination={pagination}
          apiOrigin={apiOrigin}
        />
      </div>
    </section>
  );
}
