import Link from 'next/link';
import { localizeHref } from '../i18n/routing';
import type { PortfolioSectionLink } from '../lib/portfolio-navigation';
import { appLocales, type AppLocale } from '../i18n/routing';
import type { PortfolioDictionary } from '../i18n/types';
import { SectionScrollLink } from './section-scroll-link';

interface SiteFooterProps {
  locale: AppLocale;
  dictionary: PortfolioDictionary;
  navItems: PortfolioSectionLink[];
  projectLinks?: PortfolioSectionLink[];
  pathname?: string;
  locales?: readonly AppLocale[];
}

export function SiteFooter({
  locale,
  dictionary,
  navItems,
  projectLinks = [],
  pathname = '/',
  locales = appLocales,
}: SiteFooterProps) {
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
      {locales.length > 1 ? (
        <nav className="mt-3" aria-label={dictionary.header.languageLabel}>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {appLocales
              .filter((entry) => locales.includes(entry))
              .map((entry) => (
                <li key={entry}>
                  <Link
                    href={localizeHref(entry, pathname)}
                    hrefLang={entry}
                    lang={entry}
                    aria-current={entry === locale ? 'page' : undefined}
                    className="rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/45"
                  >
                    {dictionary.localeNames[entry]}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      ) : null}
      {projectLinks.length > 0 ? (
        <nav className="mt-3" aria-label={dictionary.header.navWork}>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {projectLinks.map((item) => (
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
    </footer>
  );
}
