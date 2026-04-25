import { ArrowUpRight } from "lucide-react";
import { homeSystemNotes } from "../content/home-content";
import { ActionLink } from "../components/action-link";
import { BackendStatusBadge } from "../components/backend-status-badge";
import { PortfolioBackground } from "../components/portfolio-background";
import { PortfolioHeader } from "../components/portfolio-header";
import { PortfolioPageShell } from "../components/portfolio-page-shell";
import { HomeHeroSection } from "../sections/home/home-hero-section";
import { HomeNotesSection } from "../sections/home/home-notes-section";
import { HomeOverviewPanel } from "../sections/home/home-overview-panel";
import { HomeProjectsSection } from "../sections/home/home-projects-section";
import { HomeStackSection } from "../sections/home/home-stack-section";
import { getPortfolioHomePageData } from "../server/portfolio-page-data";

export async function PortfolioHomeScreen() {
  const {
    healthResult,
    projectsResult,
    projects,
    featuredProjects,
    leadProjects,
    secondaryProjects,
    technologies,
    latestProject,
    apiBaseUrl,
    apiDocsUrl,
  } = await getPortfolioHomePageData();

  return (
    <PortfolioPageShell>
      <PortfolioBackground />

      <PortfolioHeader
        actions={
          <>
            <BackendStatusBadge result={healthResult} compact />
            <ActionLink
              href={apiDocsUrl}
              external
              icon={<ArrowUpRight className="size-4" />}
            >
              Swagger docs
            </ActionLink>
          </>
        }
      />

      <section className="grid gap-12 pb-20 pt-16 lg:grid-cols-[minmax(0,1.1fr)_24rem] lg:items-end lg:pb-24 lg:pt-24">
        <HomeHeroSection
          latestProject={latestProject}
          projectsResult={projectsResult}
        />
        <HomeOverviewPanel
          projects={projects}
          featuredProjects={featuredProjects}
          technologies={technologies}
          latestProject={latestProject}
          apiBaseUrl={apiBaseUrl}
        />
      </section>

      <HomeStackSection technologies={technologies} />

      <HomeProjectsSection
        id="featured"
        label="Featured work"
        title="Projects pulled straight from the live backend contract."
        description="The homepage now hydrates itself from the published project feed, handles empty or offline backend states, and routes into backend-backed detail pages."
        projects={leadProjects}
        featuredCards
      />

      {secondaryProjects.length > 0 ? (
        <HomeProjectsSection
          label="Archive"
          title="Everything else the API is already ready to ship."
          description="These cards come from the same backend route, so the portfolio can grow without restructuring the frontend."
          projects={secondaryProjects}
        />
      ) : null}

      <HomeNotesSection notes={homeSystemNotes} />
    </PortfolioPageShell>
  );
}
