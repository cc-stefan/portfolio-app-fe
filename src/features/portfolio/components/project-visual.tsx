/* eslint-disable @next/next/no-img-element */

import { cn } from "@/lib/utils";
import type { PortfolioProject } from "../model/types";

interface ProjectVisualProps {
  project: PortfolioProject;
  index?: number;
  className?: string;
  alt?: string;
}

const placeholderGradients = [
  "radial-gradient(circle at top left, rgba(239, 123, 69, 0.55), transparent 34%), linear-gradient(135deg, rgba(255, 248, 240, 0.96) 0%, rgba(234, 245, 245, 0.92) 48%, rgba(20, 81, 92, 0.86) 100%)",
  "radial-gradient(circle at top right, rgba(29, 145, 155, 0.55), transparent 32%), linear-gradient(145deg, rgba(248, 243, 233, 0.96) 0%, rgba(255, 225, 199, 0.84) 55%, rgba(62, 36, 25, 0.84) 100%)",
  "radial-gradient(circle at bottom left, rgba(71, 96, 230, 0.42), transparent 30%), linear-gradient(160deg, rgba(255, 251, 245, 0.98) 0%, rgba(226, 239, 255, 0.9) 52%, rgba(27, 34, 58, 0.85) 100%)",
];

export function ProjectVisual({
  project,
  index = 0,
  className,
  alt,
}: ProjectVisualProps) {
  if (project.coverImageUrl) {
    return (
      <img
        src={project.coverImageUrl}
        alt={alt ?? `${project.title} cover image`}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn("h-full w-full", className)}
      style={{
        backgroundImage: placeholderGradients[index % placeholderGradients.length],
      }}
    >
      <div className="h-full w-full bg-[linear-gradient(135deg,rgba(255,255,255,0.22),rgba(255,255,255,0.08)_38%,rgba(15,23,42,0.24)_100%)]" />
    </div>
  );
}
