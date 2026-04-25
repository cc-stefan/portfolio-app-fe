import "server-only";
import type {
  ApiResult,
  PortfolioHealth,
  PortfolioProject,
} from "../model/types";

const DEFAULT_API_BASE_URL = "http://localhost:3001/api";

class PortfolioApiRequestError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "PortfolioApiRequestError";
  }
}

function normalizeBaseUrl(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

export function getPortfolioApiBaseUrl(): string {
  return normalizeBaseUrl(
    process.env.PORTFOLIO_API_BASE_URL ?? DEFAULT_API_BASE_URL,
  );
}

export function getPortfolioApiDocsUrl(): string {
  return `${getPortfolioApiBaseUrl()}/docs`;
}

function buildRequestUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getPortfolioApiBaseUrl()}${normalizedPath}`;
}

async function requestJson<T>(path: string): Promise<T> {
  const response = await fetch(buildRequestUrl(path), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new PortfolioApiRequestError(
      response.status,
      `Request failed with status ${response.status}`,
    );
  }

  return response.json() as Promise<T>;
}

function getErrorMessage(path: string, status: number | null): string {
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

export function getBackendHealth(): Promise<ApiResult<PortfolioHealth>> {
  return safeRequest<PortfolioHealth>("/health");
}

export function getPublishedProjects(): Promise<ApiResult<PortfolioProject[]>> {
  return safeRequest<PortfolioProject[]>("/projects");
}

export function getProjectBySlug(
  slug: string,
): Promise<ApiResult<PortfolioProject>> {
  return safeRequest<PortfolioProject>(`/projects/${encodeURIComponent(slug)}`);
}
