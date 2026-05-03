import type {PortfolioDictionary} from "../i18n/types";

export interface PortfolioSectionLink {
  href: string;
  label: string;
}

export function getPortfolioHomeSectionLinks(
  dictionary: PortfolioDictionary,
): PortfolioSectionLink[] {
  return [
    { href: "/#about", label: dictionary.header.navAbout },
    { href: "/#projects", label: dictionary.header.navWork },
    { href: "/#process", label: dictionary.header.navProcess },
    { href: "/#skills", label: dictionary.header.navSkills },
  ];
}
