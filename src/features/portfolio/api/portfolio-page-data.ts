import 'server-only';
import {
  getAvailability,
  getPortfolioApiOrigin,
  getProjectBySlug,
  getPublishedProjectsPage,
} from './portfolio-api';
import { getRelatedProjects } from '../lib/portfolio-selectors';
import type { AppLocale } from '../i18n/routing';
import type { ApiResult, PortfolioProject } from '../model/types';

export interface PortfolioHomePageData {
  projectsResult: Awaited<ReturnType<typeof getPublishedProjectsPage>>;
  availabilityResult: Awaited<ReturnType<typeof getAvailability>>;
  apiOrigin: string;
}

export interface PortfolioProjectPageData {
  projectResult: ApiResult<PortfolioProject>;
  project: PortfolioProject | null;
  relatedProjects: PortfolioProject[];
}

export async function getPortfolioHomePageData(
  locale: AppLocale,
  projectPage: number
): Promise<PortfolioHomePageData> {
  const [projectsResult, availabilityResult] = await Promise.all([
    getPublishedProjectsPage(locale, projectPage, 9),
    getAvailability(),
  ]);

  return {
    projectsResult,
    availabilityResult,
    apiOrigin: getPortfolioApiOrigin(),
  };
}

export async function getPortfolioProjectPageData(
  slug: string,
  locale: AppLocale
): Promise<PortfolioProjectPageData> {
  const [projectResult, projectsResult] = await Promise.all([
    getProjectBySlug(slug, locale),
    getPublishedProjectsPage(locale, 1, 4),
  ]);

  const project = projectResult.data;

  return {
    projectResult,
    project,
    relatedProjects: project
      ? getRelatedProjects(projectsResult.data?.items ?? [], project.slug)
      : [],
  };
}
