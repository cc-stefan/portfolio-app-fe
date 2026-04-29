import { SiteShell } from "../components/site-shell";
import { SiteHeader } from "../components/site-header";
import { BackendStatusPill } from "../components/backend-status-pill";
import type { AppLocale } from "../i18n/routing";
import type { PortfolioDictionary } from "../i18n/types";
import { HomeCapabilities } from "../sections/home/home-capabilities";
import { HomeHero } from "../sections/home/home-hero";
import { HomeInquiry } from "../sections/home/home-inquiry";
import { HomeMetrics } from "../sections/home/home-metrics";
import { HomeProcess } from "../sections/home/home-process";
import { HomeShowcase } from "../sections/home/home-showcase";
import { getPortfolioHomePageData } from "../api/portfolio-page-data";

interface PortfolioHomeScreenProps {
  locale: AppLocale;
  dictionary: PortfolioDictionary;
}

export async function PortfolioHomeScreen({
  locale,
  dictionary,
}: PortfolioHomeScreenProps) {
  const {
    healthResult,
    projects,
    projectsResult,
    featuredProjects,
    technologies,
    latestProject,
    apiBaseUrl,
    apiOrigin,
    apiDocsUrl,
  } = await getPortfolioHomePageData();

  return (
    <SiteShell locale={locale} dictionary={dictionary}>
      <SiteHeader
        locale={locale}
        dictionary={dictionary}
        eyebrow={dictionary.header.tagline}
        navItems={[
          { href: "/#overview", label: dictionary.header.navOverview },
          { href: "/#work", label: dictionary.header.navWork },
          { href: "/#process", label: dictionary.header.navProcess },
          { href: "/#contact", label: dictionary.header.navContact },
        ]}
        statusSlot={
          <BackendStatusPill
            result={healthResult}
            onlineLabel={dictionary.home.statusOnline}
            offlineLabel={dictionary.home.statusOffline}
            unavailableLabel={dictionary.home.statusUnavailable}
          />
        }
        secondaryAction={{
          href: apiDocsUrl,
          label: dictionary.actions.apiDocs,
          external: true,
        }}
        primaryAction={{
          href: "/#contact",
          label: dictionary.actions.startProject,
        }}
        className="page-enter"
      />

      <main className="flex flex-1 flex-col gap-18 pb-4 pt-10 sm:gap-24 sm:pt-14">
        <div className="page-enter delay-1">
          <HomeHero
            locale={locale}
            copy={dictionary.home}
            latestProject={latestProject}
            technologies={technologies}
            apiBaseUrl={apiBaseUrl}
          />
        </div>

        <div className="page-enter delay-2">
          <HomeMetrics
            copy={dictionary.home}
            healthResult={healthResult}
            projects={projects}
            featuredProjects={featuredProjects}
            technologies={technologies}
            apiBaseUrl={apiBaseUrl}
          />
        </div>

        <div id="work" className="anchor-target section-divider" />

        <div className="page-enter delay-2">
          <HomeShowcase
            locale={locale}
            dictionary={dictionary}
            featuredProjects={featuredProjects}
            projects={projectsResult.data ?? []}
            apiOrigin={apiOrigin}
          />
        </div>

        <div className="section-divider" />

        <div className="page-enter delay-3">
          <HomeCapabilities copy={dictionary.home} />
        </div>

        <div id="process" className="anchor-target section-divider" />

        <div className="page-enter delay-4">
          <HomeProcess copy={dictionary.home} />
        </div>

        <div id="contact" className="anchor-target section-divider" />

        <div className="page-enter delay-4">
          <HomeInquiry dictionary={dictionary} />
        </div>
      </main>
    </SiteShell>
  );
}
