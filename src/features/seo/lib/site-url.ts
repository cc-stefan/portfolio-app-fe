import {
  appLocales,
  defaultLocale,
  localeTags,
  localizeHref,
  type AppLocale,
} from '@/features/portfolio/i18n/routing';

const DEVELOPMENT_SITE_URL = 'http://localhost:3000';

function readConfiguredSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredUrl) {
    return configuredUrl;
  }

  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();

  if (vercelProductionUrl) {
    return `https://${vercelProductionUrl}`;
  }

  if (process.env.VERCEL_ENV === 'production') {
    throw new Error(
      'NEXT_PUBLIC_SITE_URL must be set to the public production origin, for example https://example.com.'
    );
  }

  return DEVELOPMENT_SITE_URL;
}

function normalizeSiteUrl(value: string) {
  const url = new URL(value);

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('NEXT_PUBLIC_SITE_URL must use http or https.');
  }

  if (url.username || url.password) {
    throw new Error('NEXT_PUBLIC_SITE_URL must not contain credentials.');
  }

  if (url.search || url.hash) {
    throw new Error('NEXT_PUBLIC_SITE_URL must not contain a query string or fragment.');
  }

  if (url.pathname !== '/') {
    throw new Error('NEXT_PUBLIC_SITE_URL must be an origin without a path.');
  }

  return url;
}

export function getSiteUrl() {
  return normalizeSiteUrl(readConfiguredSiteUrl());
}

export function getSiteOrigin() {
  return getSiteUrl().origin;
}

export function getAbsoluteUrl(pathname = '/') {
  return new URL(pathname, getSiteUrl()).toString();
}

export function getLocalizedUrl(locale: AppLocale, pathname = '/') {
  return getAbsoluteUrl(localizeHref(locale, pathname));
}

export function getLanguageAlternates(
  pathname: string,
  locales: readonly AppLocale[] = appLocales
) {
  const languages: Record<string, string> = {};

  for (const locale of locales) {
    languages[localeTags[locale]] = getLocalizedUrl(locale, pathname);
  }

  if (locales.includes(defaultLocale)) {
    languages['x-default'] = getLocalizedUrl(defaultLocale, pathname);
  }

  return languages;
}
