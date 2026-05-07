import 'server-only';
import { buildBackendApiUrl, getBackendApiBaseUrl, getBackendOrigin } from '@/lib/backend';
import type { AppLocale } from '../i18n/routing';
import type { ApiResult, PortfolioHealth, PortfolioProject } from '../model/types';

class PortfolioApiRequestError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message);
    this.name = 'PortfolioApiRequestError';
  }
}

export function getPortfolioApiBaseUrl() {
  return getBackendApiBaseUrl();
}

export function getPortfolioApiOrigin() {
  return getBackendOrigin();
}

function appendLocale(path: string, locale: AppLocale) {
  const url = new URL(path, 'https://portfolio.local');
  url.searchParams.set('locale', locale);
  return `${url.pathname}${url.search}`;
}

async function requestJson<T>(path: string): Promise<T> {
  const response = await fetch(buildBackendApiUrl(path), {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new PortfolioApiRequestError(
      response.status,
      `Request failed with status ${response.status}`
    );
  }

  return response.json() as Promise<T>;
}

function getErrorMessage(path: string, status: number | null) {
  if (status === 404) {
    return `No API resource was found for ${path}.`;
  }

  if (status !== null) {
    return `The portfolio API returned ${status} for ${path}.`;
  }

  return `Could not reach the portfolio API at ${getPortfolioApiBaseUrl()}.`;
}

async function safeRequest<T>(path: string): Promise<ApiResult<T>> {
  try {
    const data = await requestJson<T>(path);

    return {
      ok: true,
      status: 200,
      data,
      error: null,
    };
  } catch (error) {
    if (error instanceof PortfolioApiRequestError) {
      return {
        ok: false,
        status: error.status,
        data: null,
        error: getErrorMessage(path, error.status),
      };
    }

    return {
      ok: false,
      status: null,
      data: null,
      error: getErrorMessage(path, null),
    };
  }
}

export function getBackendHealth() {
  return safeRequest<PortfolioHealth>('/health');
}

export function getPublishedProjects(locale: AppLocale) {
  return safeRequest<PortfolioProject[]>(appendLocale('/projects', locale));
}

export function getProjectBySlug(slug: string, locale: AppLocale) {
  return safeRequest<PortfolioProject>(
    appendLocale(`/projects/${encodeURIComponent(slug)}`, locale)
  );
}
