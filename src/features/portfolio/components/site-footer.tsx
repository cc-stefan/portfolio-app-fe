import type {PortfolioSectionLink} from "../lib/portfolio-navigation";
import {type AppLocale} from "../i18n/routing";
import type {PortfolioDictionary} from "../i18n/types";

interface SiteFooterProps {
  locale: AppLocale;
  dictionary: PortfolioDictionary;
  navItems: PortfolioSectionLink[];
}

export function SiteFooter({dictionary}: SiteFooterProps) {
  const currentYear = new Date().getUTCFullYear();

  return (
    <footer className="mt-10 border-t border-border/80 pt-5 text-sm text-muted-foreground">
      <p>
        &copy; {currentYear} {dictionary.header.brand}. {dictionary.footer.copyrightLabel}
      </p>
    </footer>
  );
}
