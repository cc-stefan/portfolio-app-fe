import "server-only";
import {
  getBackendHealth,
  getPortfolioApiBaseUrl,
  getPortfolioApiDocsUrl,
  getPortfolioApiOrigin,
  getProjectBySlug,
  getPublishedProjects,
} from "./portfolio-api";
import {
  collectTechnologies,
  getFeaturedProjects,
  getProjectSummaryParagraphs,
  getRelatedProjects,
} from "../lib/portfolio-selectors";
import type { ApiResult, PortfolioProject } from "../model/types";

export interface PortfolioHomePageData {
  healthResult: Awaited<ReturnType<typeof getBackendHealth>>;
  projectsResult: Awaited<ReturnType<typeof getPublishedProjects>>;
  projects: PortfolioProject[];
  featuredProjects: PortfolioProject[];
  technologies: string[];
  latestProject: PortfolioProject | null;
  apiBaseUrl: string;
  apiOrigin: string;
  apiDocsUrl: string;
}

export interface PortfolioProjectPageData {
  projectResult: ApiResult<PortfolioProject>;
  project: PortfolioProject | null;
  relatedProjects: PortfolioProject[];
  paragraphs: string[];
}

export async function getPortfolioHomePageData(): Promise<PortfolioHomePageData> {
  const [healthResult, projectsResult] = await Promise.all([
    getBackendHealth(),
    getPublishedProjects(),
  ]);

  const projects = projectsResult.data ?? [];

  return {
    healthResult,
    projectsResult,
    projects,
    featuredProjects: getFeaturedProjects(projects),
    technologies: collectTechnologies(projects).slice(0, 12),
    latestProject: projects[0] ?? null,
    apiBaseUrl: getPortfolioApiBaseUrl(),
    apiOrigin: getPortfolioApiOrigin(),
    apiDocsUrl: getPortfolioApiDocsUrl(),
  };
}

export async function getPortfolioProjectPageData(
  slug: string,
): Promise<PortfolioProjectPageData> {
  const [projectResult, projectsResult] = await Promise.all([
    getProjectBySlug(slug),
    getPublishedProjects(),
  ]);

  const project = projectResult.data;

  return {
    projectResult,
    project,
    relatedProjects: project
      ? getRelatedProjects(projectsResult.data ?? [], project.slug)
      : [],
    paragraphs: project
      ? getProjectSummaryParagraphs(project.description, project.summary)
      : [],
  };
}
