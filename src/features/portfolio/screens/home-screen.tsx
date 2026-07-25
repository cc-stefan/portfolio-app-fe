import { SiteShell } from '../components/site-shell';
import { SiteHeader } from '../components/site-header';
import type { AppLocale } from '../i18n/routing';
import type { PortfolioDictionary } from '../i18n/types';
import { HomeCapabilities } from '../sections/home/home-capabilities';
import { HomeCredentials } from '../sections/home/home-credentials';
import { HomeHero } from '../sections/home/home-hero';
import { HomeInquiry } from '../sections/home/home-inquiry';
import { HomeMetrics } from '../sections/home/home-metrics';
import { HomeProcess } from '../sections/home/home-process';
import { HomeShowcase } from '../sections/home/home-showcase';
import { getPortfolioHomePageData } from '../api/portfolio-page-data';
import { getPortfolioHomeSectionLinks } from '../lib/portfolio-navigation';
import { JsonLd } from '@/features/seo/components/json-ld';
import { getHomeStructuredData } from '@/features/seo/lib/structured-data';

interface PortfolioHomeScreenProps {
  locale: AppLocale;
  dictionary: PortfolioDictionary;
}

export async function PortfolioHomeScreen({ locale, dictionary }: PortfolioHomeScreenProps) {
  const { projectsResult, apiOrigin } = await getPortfolioHomePageData(locale);
  const sectionLinks = getPortfolioHomeSectionLinks(dictionary);
  const projects = projectsResult.data ?? [];

  return (
    <SiteShell
      locale={locale}
      dictionary={dictionary}
      footerNavItems={sectionLinks}
      footerProjectLinks={projects.map((project) => ({
        href: `/projects/${project.slug}`,
        label: project.title,
      }))}
      header={
        <SiteHeader
          locale={locale}
          dictionary={dictionary}
          eyebrow={dictionary.header.tagline}
          navItems={sectionLinks}
          primaryAction={{
            href: '/#contact',
            label: dictionary.actions.startProject,
          }}
          className="page-enter"
        />
      }
    >
      <JsonLd data={getHomeStructuredData(locale, dictionary)} />
      <main
        id="main-content"
        className="flex min-w-0 w-full flex-1 flex-col gap-18 overflow-x-clip pb-4 pt-[var(--main-content-offset)] sm:gap-24"
      >
        <div className="page-enter">
          <HomeHero locale={locale} copy={dictionary.home} />
        </div>

        <div className="page-enter">
          <HomeMetrics copy={dictionary.home} />
        </div>

        <div className="page-enter">
          <HomeCapabilities copy={dictionary.home} />
        </div>

        <div className="page-enter">
          <HomeShowcase
            locale={locale}
            dictionary={dictionary}
            projects={projects}
            apiOrigin={apiOrigin}
          />
        </div>

        <div className="page-enter">
          <HomeProcess copy={dictionary.home} />
        </div>

        <div className="page-enter">
          <HomeCredentials copy={dictionary.home} />
        </div>

        <div className="page-enter">
          <HomeInquiry locale={locale} dictionary={dictionary} />
        </div>
      </main>
    </SiteShell>
  );
}
