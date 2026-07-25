import type { MetadataRoute } from 'next';
import { appLocales, type AppLocale } from '@/features/portfolio/i18n/routing';
import {
  getPortfolioApiOrigin,
  getPublishedProjects,
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
      result: await getPublishedProjects(locale),
    }))
  );
  const localizedProjects: LocalizedProject[] = [];

  for (const { locale, result } of projectResults) {
    for (const project of result.data ?? []) {
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
