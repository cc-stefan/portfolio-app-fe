import 'server-only';
import type { Metadata } from 'next';
import type { PortfolioDictionary } from '../i18n/types';
import { localeTags, type AppLocale } from '../i18n/routing';
import { getPortfolioApiOrigin, getProjectBySlug } from './portfolio-api';
import { resolvePortfolioAssetUrl } from '../lib/resolve-portfolio-asset-url';
import { getLanguageAlternates, getLocalizedUrl } from '@/features/seo/lib/site-url';

export async function getPortfolioProjectMetadata(
  slug: string,
  locale: AppLocale,
  dictionary: PortfolioDictionary
): Promise<Metadata> {
  const projectResult = await getProjectBySlug(slug, locale);
  const projectPath = `/projects/${slug}`;

  if (!projectResult.data) {
    return {
      title: dictionary.meta.projectUnavailableTitle,
      description: dictionary.meta.projectUnavailableDescription,
      alternates: {
        canonical: getLocalizedUrl(locale, projectPath),
      },
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const project = projectResult.data;
  const imageUrl = resolvePortfolioAssetUrl(project.imageUrl, getPortfolioApiOrigin());
  const contentLocales = project.availableLocales;
  const isTranslatedForRequestedLocale = contentLocales.includes(locale);
  const canonicalLocale = isTranslatedForRequestedLocale ? locale : project.contentLocale;
  const canonicalUrl = getLocalizedUrl(canonicalLocale, projectPath);
  const languages = getLanguageAlternates(projectPath, contentLocales);
  const openGraphImage = imageUrl ?? getLocalizedUrl(canonicalLocale, '/opengraph-image');
  const twitterImage = imageUrl ?? getLocalizedUrl(canonicalLocale, '/twitter-image');

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    robots: {
      index: isTranslatedForRequestedLocale,
      follow: true,
    },
    openGraph: {
      title: project.title,
      description: project.summary,
      type: 'article',
      url: canonicalUrl,
      locale: localeTags[project.contentLocale],
      siteName: dictionary.meta.siteName,
      alternateLocale: contentLocales
        .filter((entry) => entry !== project.contentLocale)
        .map((entry) => localeTags[entry]),
      images: [
        {
          url: openGraphImage,
          alt: imageUrl ? project.title : `${dictionary.header.brand} ${dictionary.header.tagline}`,
        },
      ],
      modifiedTime: project.updatedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.summary,
      images: [
        {
          url: twitterImage,
          alt: imageUrl ? project.title : `${dictionary.header.brand} ${dictionary.header.tagline}`,
        },
      ],
    },
  };
}
