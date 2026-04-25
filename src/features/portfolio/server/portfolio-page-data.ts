import "server-only";
import {
  getPortfolioApiBaseUrl,
  getPortfolioApiDocsUrl,
  getBackendHealth,
  getProjectBySlug,
  getPublishedProjects,
} from "./portfolio-api";
import {
  collectTechnologies,
  getLeadProjects,
  getProjectParagraphs,
  getRelatedProjects,
  getSecondaryProjects,
} from "../model/selectors";
import type { ApiResult, PortfolioProject } from "../model/types";

export interface PortfolioHomePageData {
  healthResult: Awaited<ReturnType<typeof getBackendHealth>>;
  projectsResult: Awaited<ReturnType<typeof getPublishedProjects>>;
  projects: PortfolioProject[];
  featuredProjects: PortfolioProject[];
  leadProjects: PortfolioProject[];
  secondaryProjects: PortfolioProject[];
  technologies: string[];
  latestProject: PortfolioProject | null;
  apiBaseUrl: string;
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
  const featuredProjects = projects.filter((project) => project.featured);
  const leadProjects = getLeadProjects(projects);
  const secondaryProjects = getSecondaryProjects(projects, leadProjects);

  return {
    healthResult,
    projectsResult,
    projects,
    featuredProjects,
    leadProjects,
    secondaryProjects,
    technologies: collectTechnologies(projects).slice(0, 12),
    latestProject: projects[0] ?? null,
    apiBaseUrl: getPortfolioApiBaseUrl(),
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
      ? getProjectParagraphs(project.description, project.summary)
      : [],
  };
}
