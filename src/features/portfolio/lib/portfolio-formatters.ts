export function formatProjectDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatProjectMonth(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
