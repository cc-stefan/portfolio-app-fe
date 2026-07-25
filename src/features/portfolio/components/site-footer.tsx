import { localizeHref } from '../i18n/routing';
import type { PortfolioSectionLink } from '../lib/portfolio-navigation';
import type { AppLocale } from '../i18n/routing';
import type { PortfolioDictionary } from '../i18n/types';
import { SectionScrollLink } from './section-scroll-link';

interface SiteFooterProps {
  locale: AppLocale;
  dictionary: PortfolioDictionary;
  navItems: PortfolioSectionLink[];
}

export function SiteFooter({ locale, dictionary, navItems }: SiteFooterProps) {
  const currentYear = new Date().getUTCFullYear();

  return (
    <footer className="mt-10 border-t border-border/80 pt-5 text-sm text-muted-foreground">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p>
          &copy; {currentYear} {dictionary.header.brand}. {dictionary.footer.copyrightLabel}
        </p>
        {navItems.length > 0 ? (
          <nav aria-label={dictionary.footer.quickLinksLabel}>
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <SectionScrollLink
                    href={localizeHref(locale, item.href)}
                    className="rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/45"
                  >
                    {item.label}
                  </SectionScrollLink>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </footer>
  );
}
