import type { PortfolioProject } from "../model/types";

export function collectTechnologies(projects: PortfolioProject[]) {
  const technologies = new Map<string, string>();

  for (const project of projects) {
    for (const technology of project.technologies) {
      const normalizedTechnology = technology.trim();

      if (!normalizedTechnology) {
        continue;
      }

      const key = normalizedTechnology.toLowerCase();

      if (!technologies.has(key)) {
        technologies.set(key, normalizedTechnology);
      }
    }
  }

  return [...technologies.values()].sort((left, right) =>
    left.localeCompare(right),
  );
}

export function getFeaturedProjects(projects: PortfolioProject[]) {
  return projects.filter((project) => project.featured);
}

export function getProjectDescriptionParagraphs(description: string | null) {
  return (description?.trim() ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function getRelatedProjects(
  projects: PortfolioProject[],
  currentSlug: string,
  limit = 3,
) {
  return projects
    .filter((project) => project.slug !== currentSlug)
    .slice(0, limit);
}
