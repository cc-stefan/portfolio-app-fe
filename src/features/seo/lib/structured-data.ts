import type { PortfolioDictionary } from '@/features/portfolio/i18n/types';
import { localeTags, type AppLocale } from '@/features/portfolio/i18n/routing';
import type { PortfolioProject } from '@/features/portfolio/model/types';
import type { JsonLdObject } from '../components/json-ld';
import { getAbsoluteUrl, getLocalizedUrl } from './site-url';

const PERSON_ID = `${getAbsoluteUrl()}#person`;
const WEBSITE_ID = `${getAbsoluteUrl()}#website`;

function getPerson(dictionary: PortfolioDictionary): JsonLdObject {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: dictionary.header.brand,
    url: getAbsoluteUrl(),
    email: 'mailto:cc.stefan@icloud.com',
    jobTitle: dictionary.header.tagline,
    knowsAbout: dictionary.home.skillHighlights,
  };
}

export function getHomeStructuredData(
  locale: AppLocale,
  dictionary: PortfolioDictionary
): JsonLdObject {
  const pageUrl = getLocalizedUrl(locale);
  const pageId = `${pageUrl}#webpage`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      getPerson(dictionary),
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: getAbsoluteUrl(),
        name: dictionary.meta.siteName,
        description: dictionary.meta.description,
        inLanguage: ['en-US', 'ro-RO'],
        author: {
          '@id': PERSON_ID,
        },
      },
      {
        '@type': 'ProfilePage',
        '@id': pageId,
        url: pageUrl,
        name: dictionary.meta.homeTitle,
        description: dictionary.meta.homeDescription,
        inLanguage: localeTags[locale],
        isPartOf: {
          '@id': WEBSITE_ID,
        },
        mainEntity: {
          '@id': PERSON_ID,
        },
      },
    ],
  };
}

interface ProjectStructuredDataOptions {
  locale: AppLocale;
  dictionary: PortfolioDictionary;
  project: PortfolioProject;
  imageUrl: string | null;
}

export function getProjectStructuredData({
  locale,
  dictionary,
  project,
  imageUrl,
}: ProjectStructuredDataOptions): JsonLdObject {
  const pageUrl = getLocalizedUrl(locale, `/projects/${project.slug}`);
  const pageId = `${pageUrl}#webpage`;
  const projectId = `${pageUrl}#project`;
  const breadcrumbId = `${pageUrl}#breadcrumb`;
  const projectData: JsonLdObject = {
    '@type': 'CreativeWork',
    '@id': projectId,
    name: project.title,
    description: project.summary,
    url: pageUrl,
    inLanguage: localeTags[project.contentLocale],
    dateModified: project.updatedAt,
    author: {
      '@id': PERSON_ID,
    },
  };

  if (imageUrl) {
    projectData.image = imageUrl;
  }

  const externalProjectUrls = [project.liveUrl, project.repositoryUrl].filter(
    (url): url is string => Boolean(url)
  );

  if (externalProjectUrls.length > 0) {
    projectData.sameAs = externalProjectUrls;
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      getPerson(dictionary),
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: getAbsoluteUrl(),
        name: dictionary.meta.siteName,
        inLanguage: ['en-US', 'ro-RO'],
        author: {
          '@id': PERSON_ID,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': breadcrumbId,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: dictionary.header.navHome,
            item: getLocalizedUrl(locale),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: project.title,
            item: pageUrl,
          },
        ],
      },
      projectData,
      {
        '@type': 'WebPage',
        '@id': pageId,
        url: pageUrl,
        name: project.title,
        description: project.summary,
        inLanguage: localeTags[project.contentLocale],
        isPartOf: {
          '@id': WEBSITE_ID,
        },
        breadcrumb: {
          '@id': breadcrumbId,
        },
        mainEntity: {
          '@id': projectId,
        },
      },
    ],
  };
}
