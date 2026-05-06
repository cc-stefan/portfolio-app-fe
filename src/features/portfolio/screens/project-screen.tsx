import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getPortfolioApiOrigin } from "../api/portfolio-api";
import { getPortfolioProjectPageData } from "../api/portfolio-page-data";
import { SiteHeader } from "../components/site-header";
import { SiteShell } from "../components/site-shell";
import { StateCard } from "../components/state-card";
import type { AppLocale } from "../i18n/routing";
import { localizeHref } from "../i18n/routing";
import type { PortfolioDictionary } from "../i18n/types";
import { getPortfolioHomeSectionLinks } from "../lib/portfolio-navigation";
import { ProjectContent } from "../sections/project/project-content";
import { ProjectHero } from "../sections/project/project-hero";
import { ProjectRelated } from "../sections/project/project-related";

interface PortfolioProjectScreenProps {
  slug: string;
  locale: AppLocale;
  dictionary: PortfolioDictionary;
}

export async function PortfolioProjectScreen({
  slug,
  locale,
  dictionary,
}: PortfolioProjectScreenProps) {
  const { projectResult, project, relatedProjects } =
    await getPortfolioProjectPageData(slug);
  const hasProjectLinks = Boolean(project?.liveUrl || project?.repositoryUrl);

  if (projectResult.status === 404) {
    notFound();
  }

  const apiOrigin = getPortfolioApiOrigin();
  const footerNavItems = getPortfolioHomeSectionLinks(dictionary);

  return (
    <SiteShell
      locale={locale}
      dictionary={dictionary}
      footerNavItems={footerNavItems}
    >
      <SiteHeader
        locale={locale}
        dictionary={dictionary}
        navItems={[
          { href: "/#projects", label: dictionary.header.navWork },
          { href: "#overview", label: dictionary.project.overviewTitle },
          ...(hasProjectLinks
            ? [{ href: "#links", label: dictionary.project.linksTitle }]
            : []),
          { href: "#timeline", label: dictionary.project.timelineTitle },
        ]}
        primaryAction={{
          href: "/#contact",
          label: dictionary.actions.startProject,
        }}
        className="page-enter"
      />

      <main className="flex flex-1 flex-col gap-16 pb-4 pt-10 sm:pt-14">
        {!project ? (
          <div className="page-enter">
            <StateCard
              eyebrow={dictionary.project.label}
              title={dictionary.project.unavailableTitle}
              description={dictionary.project.unavailableDescription}
              tone="warning"
              action={
                <Button asChild size="lg">
                  <Link href={localizeHref(locale, "/")}>
                    {dictionary.project.backToHome}
                  </Link>
                </Button>
              }
            />
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {dictionary.project.unavailableHint}
            </p>
          </div>
        ) : (
          <>
            <div className="page-enter">
              <ProjectHero
                locale={locale}
                dictionary={dictionary}
                project={project}
                apiOrigin={apiOrigin}
              />
            </div>

            <div className="page-enter">
              <ProjectContent
                locale={locale}
                dictionary={dictionary}
                project={project}
              />
            </div>

            <div className="page-enter">
              <ProjectRelated
                locale={locale}
                dictionary={dictionary}
                relatedProjects={relatedProjects}
                apiOrigin={apiOrigin}
              />
            </div>
          </>
        )}
      </main>
    </SiteShell>
  );
}
