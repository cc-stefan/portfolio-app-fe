import { defineRouting } from 'next-intl/routing';

export const appLocales = ['en', 'ro'] as const;

export type AppLocale = (typeof appLocales)[number];

export const defaultLocale: AppLocale = 'en';

export const localeTags: Record<AppLocale, string> = {
  en: 'en-US',
  ro: 'ro-RO',
};

export const routing = defineRouting({
  locales: appLocales,
  defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: false,
});
