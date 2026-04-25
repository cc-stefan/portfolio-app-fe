import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { ActionLink } from "../components/action-link";
import { PortfolioHeader } from "../components/portfolio-header";
import { PortfolioPageShell } from "../components/portfolio-page-shell";
import { ProjectHeroSection } from "../sections/project/project-hero-section";
import { ProjectMediaSection } from "../sections/project/project-media-section";
import { ProjectOverviewSection } from "../sections/project/project-overview-section";
import { ProjectRelatedSection } from "../sections/project/project-related-section";
import { ProjectUnavailableState } from "../sections/project/project-unavailable-state";
import { getPortfolioProjectPageData } from "../server/portfolio-page-data";

interface PortfolioProjectScreenProps {
  slug: string;
}

export async function PortfolioProjectScreen({
  slug,
}: PortfolioProjectScreenProps) {
  const { projectResult, project, relatedProjects, paragraphs } =
    await getPortfolioProjectPageData(slug);

  if (projectResult.status === 404) {
    notFound();
  }

  return (
    <PortfolioPageShell contentClassName={!project ? "max-w-6xl" : undefined}>
      <PortfolioHeader
        actions={
          <ActionLink
            href="/"
            icon={<ArrowLeft className="size-4" />}
            iconPosition="start"
          >
            Back home
          </ActionLink>
        }
      />

      {!project ? (
        <ProjectUnavailableState errorMessage={projectResult.error} />
      ) : (
        <>
          <ProjectHeroSection project={project} />
          <ProjectMediaSection project={project} />
          <ProjectOverviewSection paragraphs={paragraphs} />
          <ProjectRelatedSection relatedProjects={relatedProjects} />
        </>
      )}
    </PortfolioPageShell>
  );
}
