export const appLocales = ["en", "ro"] as const;

export type AppLocale = (typeof appLocales)[number];

export const defaultLocale: AppLocale = "en";

export const localeTags: Record<AppLocale, string> = {
  en: "en-US",
  ro: "ro-RO",
};

export function isAppLocale(value: string): value is AppLocale {
  return appLocales.includes(value as AppLocale);
}

export function localizeHref(locale: AppLocale, href: string): string {
  if (!href || href.startsWith("#") || href.startsWith("http")) {
    return href;
  }

  const normalizedHref = href.startsWith("/") ? href : `/${href}`;
  const localePrefix = locale === defaultLocale ? "" : `/${locale}`;

  if (normalizedHref === "/") {
    return localePrefix || "/";
  }

  return `${localePrefix}${normalizedHref}`;
}

export function replaceLocaleInPathname(
  pathname: string,
  locale: AppLocale,
): string {
  const segments = pathname.split("/");
  const pathWithoutLocale =
    segments.length > 1 && isAppLocale(segments[1] ?? "")
      ? `/${segments.slice(2).join("/")}`
      : pathname;

  const normalizedPathname = pathWithoutLocale.startsWith("/")
    ? pathWithoutLocale
    : `/${pathWithoutLocale}`;
  const cleanPathname =
    normalizedPathname === "/" ? "/" : normalizedPathname.replace(/\/$/, "");

  if (locale === defaultLocale) {
    return cleanPathname;
  }

  return cleanPathname === "/" ? `/${locale}` : `/${locale}${cleanPathname}`;
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

    if (language?.startsWith("en")) {
      return "en";
    }
  }

  return defaultLocale;
}
