import {hasLocale} from "next-intl";
import {appLocales, defaultLocale, localeTags} from "@/i18n/routing";

export {appLocales, defaultLocale, localeTags};

export type AppLocale = (typeof appLocales)[number];

export function isAppLocale(value: string): value is AppLocale {
  return hasLocale(appLocales, value);
}

function normalizePathname(pathname: string) {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.replace(/\/+$/, "") || "/";
}

function stripLocalePrefix(pathname: string) {
  const normalizedPathname = normalizePathname(pathname);
  const segments = normalizedPathname.split("/");

  if (!isAppLocale(segments[1] ?? "")) {
    return normalizedPathname;
  }

  return normalizePathname(`/${segments.slice(2).join("/")}`);
}

export function localizeHref(locale: AppLocale, href: string): string {
  if (!href || href.startsWith("#") || /^[a-z]+:/i.test(href)) {
    return href;
  }

  const normalizedHref = href.startsWith("/") ? href : `/${href}`;
  const url = new URL(normalizedHref, "https://portfolio.local");
  const pathname = stripLocalePrefix(url.pathname);
  const localePrefix = locale === defaultLocale ? "" : `/${locale}`;
  const localizedPathname =
    pathname === "/" ? localePrefix || "/" : `${localePrefix}${pathname}`;

  return `${localizedPathname}${url.search}${url.hash}`;
}
