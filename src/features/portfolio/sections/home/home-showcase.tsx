import { ProjectGridTabs } from "../../components/project-grid-tabs";
import { SectionIntro } from "../../components/section-intro";
import type { AppLocale } from "../../i18n/routing";
import type { PortfolioDictionary } from "../../i18n/types";
import type { PortfolioProject } from "../../model/types";

interface HomeShowcaseProps {
  locale: AppLocale;
  dictionary: PortfolioDictionary;
  featuredProjects: PortfolioProject[];
  projects: PortfolioProject[];
  apiOrigin: string;
}

export function HomeShowcase({
  locale,
  dictionary,
  featuredProjects,
  projects,
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
          dictionary={dictionary}
          featuredProjects={featuredProjects}
          projects={projects}
          apiOrigin={apiOrigin}
        />
      </div>
    </section>
  );
}
