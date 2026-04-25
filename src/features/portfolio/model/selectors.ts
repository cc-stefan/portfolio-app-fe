import type { PortfolioProject } from "./types";

export function collectTechnologies(projects: PortfolioProject[]): string[] {
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

export function getLeadProjects(
  projects: PortfolioProject[],
  limit = 3,
): PortfolioProject[] {
  const featuredProjects = projects.filter((project) => project.featured);
  const sourceProjects = featuredProjects.length > 0 ? featuredProjects : projects;

  return sourceProjects.slice(0, limit);
}

export function getSecondaryProjects(
  projects: PortfolioProject[],
  leadProjects: PortfolioProject[],
  limit = 6,
): PortfolioProject[] {
  const leadProjectSlugs = new Set(leadProjects.map((project) => project.slug));

  return projects
    .filter((project) => !leadProjectSlugs.has(project.slug))
    .slice(0, limit);
}

export function getRelatedProjects(
  projects: PortfolioProject[],
  currentProjectSlug: string,
  limit = 3,
): PortfolioProject[] {
  return projects
    .filter((project) => project.slug !== currentProjectSlug)
    .slice(0, limit);
}

export function getProjectParagraphs(
  description: string | null,
  summary: string,
): string[] {
  const source = description?.trim() || summary.trim();

  return source
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
