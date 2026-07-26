import type { ReactNode } from 'react';
import type { PortfolioSectionLink } from '../lib/portfolio-navigation';
import type { AppLocale } from '../i18n/routing';
import type { PortfolioDictionary } from '../i18n/types';
import { SectionScrollRestorer } from './section-scroll-restorer';
import { SiteFooter } from './site-footer';

interface SiteShellProps {
  children: ReactNode;
  header: ReactNode;
  locale: AppLocale;
  dictionary: PortfolioDictionary;
  footerNavItems?: PortfolioSectionLink[];
}

export function SiteShell({
  children,
  header,
  locale,
  dictionary,
  footerNavItems = [],
}: SiteShellProps) {
  return (
    <div className="page-shell">
      <SectionScrollRestorer />
      {header}
      <div className="container-page flex min-h-[var(--app-viewport-height)] flex-col pb-[calc(1rem_+_var(--safe-area-inset-bottom))] pt-4 sm:pb-[calc(1.5rem_+_var(--safe-area-inset-bottom))] sm:pt-6">
        <div className="safe-content-frame flex flex-1 flex-col">
          {children}
          <SiteFooter locale={locale} dictionary={dictionary} navItems={footerNavItems} />
        </div>
      </div>
    </div>
  );
}
