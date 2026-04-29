export const appLocales = ["en", "ro", "zh"] as const;

export type AppLocale = (typeof appLocales)[number];

export const defaultLocale: AppLocale = "en";

export const localeTags: Record<AppLocale, string> = {
  en: "en-US",
  ro: "ro-RO",
  zh: "zh-CN",
};

export function isAppLocale(value: string): value is AppLocale {
  return appLocales.includes(value as AppLocale);
}

export function localizeHref(locale: AppLocale, href: string): string {
  if (!href || href.startsWith("#") || href.startsWith("http")) {
    return href;
  }

  const normalizedHref = href.startsWith("/") ? href : `/${href}`;

  if (normalizedHref === "/") {
    return `/${locale}`;
  }

  return `/${locale}${normalizedHref}`;
}

export function replaceLocaleInPathname(
  pathname: string,
  locale: AppLocale,
): string {
  const segments = pathname.split("/");

  if (segments.length > 1 && isAppLocale(segments[1] ?? "")) {
    segments[1] = locale;
    return segments.join("/") || `/${locale}`;
  }

  const normalizedPathname = pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (normalizedPathname === "/") {
    return `/${locale}`;
  }

  return `/${locale}${normalizedPathname}`;
}

export function getPreferredLocale(headerValue: string | null): AppLocale {
  if (!headerValue) {
    return defaultLocale;
  }

  const requestedLanguages = headerValue
    .split(",")
    .map((part) => part.trim().split(";")[0]?.toLowerCase())
    .filter(Boolean);

  for (const language of requestedLanguages) {
    if (language?.startsWith("ro")) {
      return "ro";
    }

    if (language?.startsWith("zh")) {
      return "zh";
    }

    if (language?.startsWith("en")) {
      return "en";
    }
  }

  return defaultLocale;
}
