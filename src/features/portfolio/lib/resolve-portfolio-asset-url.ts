export function resolvePortfolioAssetUrl(value: string | null, apiOrigin: string) {
  if (!value) {
    return null;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const normalizedValue = value.startsWith('/') ? value : `/${value}`;
  return `${apiOrigin}${normalizedValue}`;
}
