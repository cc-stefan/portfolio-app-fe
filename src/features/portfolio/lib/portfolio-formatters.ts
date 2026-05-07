function parseProjectDate(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const parsedValue = new Date(value);

  if (Number.isNaN(parsedValue.getTime())) {
    return null;
  }

  return parsedValue;
}

export function formatProjectDate(value: string | null | undefined, locale: string) {
  const parsedValue = parseProjectDate(value);

  if (!parsedValue) {
    return null;
  }

  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parsedValue);
}

export function formatProjectMonth(value: string | null | undefined, locale: string) {
  return formatProjectDate(value, locale);
}
