import type { ReactNode } from 'react';
import type { PortfolioSectionLink } from '../lib/portfolio-navigation';
import type { AppLocale } from '../i18n/routing';
import type { PortfolioDictionary } from '../i18n/types';
import { SectionScrollRestorer } from './section-scroll-restorer';
import { SiteFooter } from './site-footer';

interface SiteShellProps {
  children: ReactNode;
  locale: AppLocale;
  dictionary: PortfolioDictionary;
  footerNavItems?: PortfolioSectionLink[];
}

export function SiteShell({ children, locale, dictionary, footerNavItems = [] }: SiteShellProps) {
  return (
    <div className="page-shell">
      <SectionScrollRestorer />
      <div className="container-page flex min-h-screen flex-col py-4 sm:py-6">
        {children}
        <SiteFooter locale={locale} dictionary={dictionary} navItems={footerNavItems} />
      </div>
    </div>
  );
}
