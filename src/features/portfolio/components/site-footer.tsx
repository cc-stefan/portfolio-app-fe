import Link from "next/link";
import { localizeHref, type AppLocale } from "../i18n/routing";
import type { PortfolioDictionary } from "../i18n/types";

interface SiteFooterProps {
  locale: AppLocale;
  dictionary: PortfolioDictionary;
}

export function SiteFooter({ locale, dictionary }: SiteFooterProps) {
  return (
    <footer className="mt-20 border-t border-border/80 py-8 sm:mt-28">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <p className="text-sm font-semibold text-foreground">
            {dictionary.header.brand}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {dictionary.meta.description}
          </p>
        </div>
        <nav
          className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
          aria-label="Footer"
        >
          <FooterLink href={localizeHref(locale, "/#overview")}>
            {dictionary.header.navOverview}
          </FooterLink>
          <FooterLink href={localizeHref(locale, "/#work")}>
            {dictionary.header.navWork}
          </FooterLink>
          <FooterLink href={localizeHref(locale, "/#contact")}>
            {dictionary.header.navContact}
          </FooterLink>
        </nav>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg px-3 py-2 transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/45"
    >
      {children}
    </Link>
  );
}
