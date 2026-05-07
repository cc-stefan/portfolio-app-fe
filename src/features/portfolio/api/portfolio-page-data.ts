import 'server-only';
import {
  getBackendHealth,
  getPortfolioApiBaseUrl,
  getPortfolioApiOrigin,
  getProjectBySlug,
  getPublishedProjects,
} from './portfolio-api';
import {
  collectTechnologies,
  getFeaturedProjects,
  getRelatedProjects,
} from '../lib/portfolio-selectors';
import type { AppLocale } from '../i18n/routing';
import type { ApiResult, PortfolioProject } from '../model/types';

export interface PortfolioHomePageData {
  healthResult: Awaited<ReturnType<typeof getBackendHealth>>;
  projectsResult: Awaited<ReturnType<typeof getPublishedProjects>>;
  projects: PortfolioProject[];
  featuredProjects: PortfolioProject[];
  technologies: string[];
  latestProject: PortfolioProject | null;
  apiBaseUrl: string;
  apiOrigin: string;
}

export interface PortfolioProjectPageData {
  projectResult: ApiResult<PortfolioProject>;
  project: PortfolioProject | null;
  relatedProjects: PortfolioProject[];
}

export async function getPortfolioHomePageData(locale: AppLocale): Promise<PortfolioHomePageData> {
  const [healthResult, projectsResult] = await Promise.all([
    getBackendHealth(),
    getPublishedProjects(locale),
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
  };
}

export async function getPortfolioProjectPageData(
  slug: string,
  locale: AppLocale
): Promise<PortfolioProjectPageData> {
  const [projectResult, projectsResult] = await Promise.all([
    getProjectBySlug(slug, locale),
    getPublishedProjects(locale),
  ]);

  const project = projectResult.data;

  return {
    projectResult,
    project,
    relatedProjects: project ? getRelatedProjects(projectsResult.data ?? [], project.slug) : [],
  };
}
