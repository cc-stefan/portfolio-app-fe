import type { ReactNode } from "react";
import type { AppLocale } from "../i18n/routing";
import type { PortfolioDictionary } from "../i18n/types";
import { SiteFooter } from "./site-footer";

interface SiteShellProps {
  children: ReactNode;
  locale: AppLocale;
  dictionary: PortfolioDictionary;
}

export function SiteShell({ children, locale, dictionary }: SiteShellProps) {
  return (
    <div className="page-shell">
      <div className="container-page flex min-h-screen flex-col py-4 sm:py-6">
        {children}
        <SiteFooter locale={locale} dictionary={dictionary} />
      </div>
    </div>
  );
}
