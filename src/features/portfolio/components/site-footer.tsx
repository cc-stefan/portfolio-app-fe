import { ArrowUpRight, GitBranch, Mail } from "lucide-react";
import type { PortfolioSectionLink } from "../lib/portfolio-navigation";
import { localizeHref, type AppLocale } from "../i18n/routing";
import type { PortfolioDictionary } from "../i18n/types";
import { SectionScrollLink } from "./section-scroll-link";

interface SiteFooterProps {
  locale: AppLocale;
  dictionary: PortfolioDictionary;
  navItems: PortfolioSectionLink[];
}

export function SiteFooter({ locale, dictionary, navItems }: SiteFooterProps) {
  const currentYear = new Date().getUTCFullYear();

  return (
    <footer className="mt-20 border-t border-border/80 py-10 sm:mt-28 sm:py-12">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_repeat(3,minmax(0,0.8fr))]">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            {dictionary.header.tagline}
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-foreground sm:text-3xl">
            {dictionary.header.brand}
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
            {dictionary.footer.description}
          </p>
        </div>

        <FooterColumn title={dictionary.footer.quickLinksLabel}>
          <nav className="grid gap-2" aria-label={dictionary.footer.quickLinksLabel}>
            {navItems.map((item) => (
              <FooterScrollLink key={item.href} href={item.href}>
                {item.label}
              </FooterScrollLink>
            ))}
          </nav>
        </FooterColumn>

        <FooterColumn title={dictionary.footer.contactLabel}>
          <div className="grid gap-2">
            <FooterExternalLink
              href={`mailto:${dictionary.footer.email}`}
              label={dictionary.footer.emailLabel}
              value={dictionary.footer.email}
              icon={<Mail className="size-4" />}
            />
            <FooterScrollLink href={localizeHref(locale, "/#contact")}>
              {dictionary.footer.contactCtaLabel}
            </FooterScrollLink>
          </div>
        </FooterColumn>

        <FooterColumn title={dictionary.footer.socialLabel}>
          <div className="grid gap-2">
            <FooterExternalLink
              href={dictionary.footer.githubHref}
              label={dictionary.footer.githubLabel}
              value={dictionary.footer.githubLabel}
              icon={<GitBranch className="size-4" />}
            />
            <FooterExternalLink
              href={dictionary.footer.sourceHref}
              label={dictionary.footer.sourceLabel}
              value={dictionary.footer.sourceLabel}
            />
          </div>
        </FooterColumn>
      </div>

      <div className="mt-10 flex flex-col gap-3 border-t border-border/80 pt-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          &copy; {currentYear} {dictionary.header.brand}.{" "}
          {dictionary.header.tagline}. {dictionary.footer.copyrightLabel}
        </p>
        <p>{dictionary.footer.stackNote}</p>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function FooterScrollLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <SectionScrollLink
      href={href}
      className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/45"
    >
      {children}
    </SectionScrollLink>
  );
}

function FooterExternalLink({
  href,
  label,
  value,
  icon,
}: {
  href: string;
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
      className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/45"
      aria-label={label}
    >
      <span className="inline-flex min-w-0 items-center gap-2">
        {icon}
        <span className="truncate">{value}</span>
      </span>
      <ArrowUpRight className="size-4 shrink-0" />
    </a>
  );
}
