import { ArrowRight } from "lucide-react";
import type { PortfolioProject } from "../model/types";

interface ProjectPreviewListProps {
  projects: PortfolioProject[];
  emptyMessage: string;
}

export function ProjectPreviewList({
  projects,
  emptyMessage,
}: ProjectPreviewListProps) {
  if (projects.length === 0) {
    return (
      <p className="rounded-[1.25rem] border border-dashed border-black/10 px-4 py-3 text-sm leading-6 text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <div
          key={project.id}
          className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-black/8 bg-white/70 px-4 py-3"
        >
          <div>
            <p className="text-sm font-medium text-foreground">
              {project.title}
            </p>
            <p className="text-xs uppercase tracking-[0.22em] text-foreground/45">
              {project.slug}
            </p>
          </div>
          <ArrowRight className="size-4 text-foreground/45" />
        </div>
      ))}
    </div>
  );
}
