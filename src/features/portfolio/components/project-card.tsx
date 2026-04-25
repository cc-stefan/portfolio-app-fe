import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatProjectMonth } from "../model/formatters";
import type { PortfolioProject } from "../model/types";
import { ProjectActionLinks } from "./project-action-links";
import { ProjectVisual } from "./project-visual";
import { TechnologyCloud } from "./technology-cloud";

interface ProjectCardProps {
  project: PortfolioProject;
  index: number;
  featured?: boolean;
  className?: string;
}

export function ProjectCard({
  project,
  index,
  featured = false,
  className,
}: ProjectCardProps) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[2rem] border border-black/10 bg-white/72 p-4 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_32px_100px_-48px_rgba(15,23,42,0.55)]",
        featured ? "lg:p-5" : "",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-[1.6rem] border border-black/10 bg-black/5">
        <ProjectVisual
          project={project}
          index={index}
          className="transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.05),rgba(15,23,42,0.5))]" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/20 bg-white/12 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-white backdrop-blur-sm">
            {project.featured ? "Featured" : "Published"}
          </span>
          <span className="rounded-full border border-white/20 bg-white/12 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-white/80 backdrop-blur-sm">
            {formatProjectMonth(project.updatedAt)}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-white/72">
              {project.slug}
            </p>
            <p className="mt-2 text-xl font-semibold tracking-[-0.04em] text-white sm:text-2xl">
              {project.title}
            </p>
          </div>
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition group-hover:bg-white group-hover:text-slate-950">
            <ArrowRight className="size-5" />
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <p className="text-sm leading-7 text-muted-foreground sm:text-base">
          {project.summary}
        </p>

        <TechnologyCloud technologies={project.technologies} limit={4} size="sm" />

        <ProjectActionLinks
          project={project}
          showCaseStudy
          className="flex flex-wrap gap-3 pt-2"
        />
      </div>
    </article>
  );
}
