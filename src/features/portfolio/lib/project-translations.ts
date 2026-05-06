import { defaultLocale, type AppLocale } from "../i18n/routing";
import type { ProjectTranslation } from "../model/types";

export function resolveProjectTranslation(
  translations: ProjectTranslation[],
  locale: AppLocale,
) {
  return (
    translations.find((translation) => translation.locale === locale) ??
    translations.find((translation) => translation.locale === defaultLocale) ??
    translations[0] ??
    null
  );
}
