const monthYearFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  year: "numeric",
});

const fullDateFormatter = new Intl.DateTimeFormat("en", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

export function formatProjectMonth(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return monthYearFormatter.format(date);
}

export function formatProjectDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return fullDateFormatter.format(date);
}
