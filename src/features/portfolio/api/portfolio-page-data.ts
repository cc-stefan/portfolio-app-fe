import 'server-only';
import { getPortfolioApiOrigin, getProjectBySlug, getPublishedProjects } from './portfolio-api';
import { getRelatedProjects } from '../lib/portfolio-selectors';
import type { AppLocale } from '../i18n/routing';
import type { ApiResult, PortfolioProject } from '../model/types';

export interface PortfolioHomePageData {
  projectsResult: Awaited<ReturnType<typeof getPublishedProjects>>;
  apiOrigin: string;
}

export interface PortfolioProjectPageData {
  projectResult: ApiResult<PortfolioProject>;
  project: PortfolioProject | null;
  relatedProjects: PortfolioProject[];
}

export async function getPortfolioHomePageData(locale: AppLocale): Promise<PortfolioHomePageData> {
  const projectsResult = await getPublishedProjects(locale);

  return {
    projectsResult,
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
