const DEFAULT_API_BASE_URL = "http://localhost:3001/api";

function normalizeBaseUrl(value: string) {
  return value.trim().replace(/\/+$/, "");
}

export function getBackendApiBaseUrl() {
  return normalizeBaseUrl(
    process.env.NEXT_PUBLIC_PORTFOLIO_API_BASE_URL ??
      process.env.PORTFOLIO_API_BASE_URL ??
      DEFAULT_API_BASE_URL,
  );
}

export function getBackendOrigin() {
  return getBackendApiBaseUrl().replace(/\/api$/, "");
}

export function getBackendDocsUrl() {
  return `${getBackendApiBaseUrl()}/docs`;
}

export function shouldExposeBackendDocs() {
  return process.env.NODE_ENV !== "production";
}

export function buildBackendApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getBackendApiBaseUrl()}${normalizedPath}`;
}

export function resolveBackendAssetUrl(value: string | null) {
  if (!value) {
    return null;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const normalizedValue = value.startsWith("/") ? value : `/${value}`;
  return `${getBackendOrigin()}${normalizedValue}`;
}

export function isBackendUploadPath(value: string | null) {
  return Boolean(value?.startsWith("/uploads"));
}
