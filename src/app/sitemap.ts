import type { MetadataRoute } from 'next';
import { appLocales, type AppLocale } from '@/features/portfolio/i18n/routing';
import {
  getPortfolioApiOrigin,
  getPublishedProjectsPage,
} from '@/features/portfolio/api/portfolio-api';
import { resolvePortfolioAssetUrl } from '@/features/portfolio/lib/resolve-portfolio-asset-url';
import type { PortfolioProject } from '@/features/portfolio/model/types';
import { getLanguageAlternates, getLocalizedUrl } from '@/features/seo/lib/site-url';

interface LocalizedProject {
  locale: AppLocale;
  project: PortfolioProject;
}

function isValidDate(value: string) {
  return !Number.isNaN(Date.parse(value));
}

function getProjectEntries(localizedProjects: LocalizedProject[]): MetadataRoute.Sitemap {
  const apiOrigin = getPortfolioApiOrigin();

  return localizedProjects.map(({ locale, project }) => {
    const pathname = `/projects/${project.slug}`;
    const imageUrl = resolvePortfolioAssetUrl(project.imageUrl, apiOrigin);

    return {
      url: getLocalizedUrl(locale, pathname),
      lastModified: isValidDate(project.updatedAt) ? project.updatedAt : undefined,
      changeFrequency: 'monthly',
      priority: project.featured ? 0.8 : 0.7,
      alternates: {
        languages: getLanguageAlternates(pathname, project.availableLocales),
      },
      images: imageUrl ? [imageUrl] : undefined,
    };
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projectResults = await Promise.all(
    appLocales.map(async (locale) => ({
      locale,
      projects: await getAllPublishedProjects(locale),
    }))
  );
  const localizedProjects: LocalizedProject[] = [];

  for (const { locale, projects } of projectResults) {
    for (const project of projects) {
      if (project.availableLocales.includes(locale)) {
        localizedProjects.push({ locale, project });
      }
    }
  }

  const homeEntries: MetadataRoute.Sitemap = appLocales.map((locale) => ({
    url: getLocalizedUrl(locale),
    changeFrequency: 'weekly',
    priority: 1,
    alternates: {
      languages: getLanguageAlternates('/'),
    },
  }));

  return [...homeEntries, ...getProjectEntries(localizedProjects)];
}

async function getAllPublishedProjects(locale: AppLocale) {
  const firstPageResult = await getPublishedProjectsPage(locale, 1, 50);
  const firstPage = firstPageResult.data;

  if (!firstPage) {
    return [];
  }

  const remainingPageNumbers = Array.from(
    { length: Math.max(0, firstPage.pagination.totalPages - 1) },
    (_, index) => index + 2
  );
  const remainingPageResults = await Promise.all(
    remainingPageNumbers.map((page) => getPublishedProjectsPage(locale, page, 50))
  );

  return [
    ...firstPage.items,
    ...remainingPageResults.flatMap((result) => result.data?.items ?? []),
  ];
}
