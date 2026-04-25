import { ArrowRight, GitBranch, Globe2 } from "lucide-react";
import { ActionLink } from "./action-link";
import type { PortfolioProject } from "../model/types";

interface ProjectActionLinksProps {
  project: Pick<PortfolioProject, "slug" | "liveUrl" | "repositoryUrl">;
  showCaseStudy?: boolean;
  className?: string;
}

export function ProjectActionLinks({
  project,
  showCaseStudy = false,
  className,
}: ProjectActionLinksProps) {
  return (
    <div className={className}>
      {showCaseStudy ? (
        <ActionLink
          href={`/projects/${project.slug}`}
          variant="primary"
          icon={<ArrowRight className="size-4" />}
          className="mr-3"
        >
          Case study
        </ActionLink>
      ) : null}
      {project.liveUrl ? (
        <ActionLink
          href={project.liveUrl}
          external
          icon={<Globe2 className="size-4" />}
          className={showCaseStudy ? "mr-3" : undefined}
        >
          {showCaseStudy ? "Live" : "View live project"}
        </ActionLink>
      ) : null}
      {project.repositoryUrl ? (
        <ActionLink
          href={project.repositoryUrl}
          external
          icon={<GitBranch className="size-4" />}
        >
          {showCaseStudy ? "Code" : "Source code"}
        </ActionLink>
      ) : null}
    </div>
  );
}
