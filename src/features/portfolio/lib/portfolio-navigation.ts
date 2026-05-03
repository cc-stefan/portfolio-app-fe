import { localizeHref, type AppLocale } from "../i18n/routing";
import type { PortfolioDictionary } from "../i18n/types";

export interface PortfolioSectionLink {
  href: string;
  label: string;
}

export function getPortfolioHomeSectionLinks(
  locale: AppLocale,
  dictionary: PortfolioDictionary,
): PortfolioSectionLink[] {
  return [
    { href: localizeHref(locale, "/#home"), label: dictionary.header.navHome },
    { href: localizeHref(locale, "/#about"), label: dictionary.header.navAbout },
    { href: localizeHref(locale, "/#projects"), label: dictionary.header.navWork },
    { href: localizeHref(locale, "/#process"), label: dictionary.header.navProcess },
    { href: localizeHref(locale, "/#skills"), label: dictionary.header.navSkills },
    { href: localizeHref(locale, "/#contact"), label: dictionary.header.navContact },
  ];
}
