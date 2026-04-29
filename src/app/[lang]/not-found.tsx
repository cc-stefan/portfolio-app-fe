import { LocaleAwareNotFoundScreen } from "@/features/portfolio/screens/locale-aware-not-found-screen";
import { getDictionary } from "@/features/portfolio/i18n/dictionaries";
import { appLocales } from "@/features/portfolio/i18n/routing";
import type { AppLocale } from "@/features/portfolio/i18n/routing";
import type { PortfolioDictionary } from "@/features/portfolio/i18n/types";

export default async function LocaleNotFound() {
  const localizedEntries = await Promise.all(
    appLocales.map(async (locale) => [locale, await getDictionary(locale)] as const),
  );

  const dictionaries = Object.fromEntries(localizedEntries) as Record<
    AppLocale,
    PortfolioDictionary
  >;

  return <LocaleAwareNotFoundScreen dictionaries={dictionaries} />;
}
