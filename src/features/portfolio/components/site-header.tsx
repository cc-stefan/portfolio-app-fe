import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { localizeHref, type AppLocale } from "../i18n/routing";
import type { PortfolioDictionary } from "../i18n/types";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileNavSheet } from "./mobile-nav-sheet";
import { ThemeToggle } from "./theme-toggle";

interface HeaderAction {
  href: string;
  label: string;
  external?: boolean;
}

interface SiteHeaderProps {
  locale: AppLocale;
  dictionary: PortfolioDictionary;
  navItems: Array<{ href: string; label: string }>;
  eyebrow?: string;
  statusSlot?: React.ReactNode;
  primaryAction?: HeaderAction;
  secondaryAction?: HeaderAction;
  className?: string;
}

export function SiteHeader({
  locale,
  dictionary,
  navItems,
  eyebrow,
  statusSlot,
  primaryAction,
  secondaryAction,
  className,
}: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "surface-card sticky top-3 z-40 rounded-2xl px-3 py-3 sm:top-5 sm:px-4",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Link
          href={localizeHref(locale, "/")}
          className="group flex min-w-0 items-center gap-3 rounded-xl pr-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/45"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-foreground text-sm font-semibold text-background transition-transform duration-200 group-hover:scale-95">
            {dictionary.header.brand.slice(0, 1)}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-foreground">
              {dictionary.header.brand}
            </span>
            <span className="block truncate text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {eyebrow ?? dictionary.header.tagline}
            </span>
          </span>
        </Link>

        <NavigationMenu className="ml-4 hidden lg:flex">
          <NavigationMenuList>
            {navItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink asChild>
                  <Link href={localizeHref(locale, item.href)}>{item.label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          {statusSlot}
          {secondaryAction ? (
            <HeaderButton
              action={secondaryAction}
              locale={locale}
              variant="outline"
            />
          ) : null}
          {primaryAction ? (
            <HeaderButton
              action={primaryAction}
              locale={locale}
              variant="primary"
            />
          ) : null}
          <LocaleSwitcher
            locale={locale}
            localeNames={dictionary.localeNames}
            label={dictionary.header.languageLabel}
          />
          <ThemeToggle label={dictionary.header.themeLabel} />
        </div>

        <div className="ml-auto flex items-center gap-2 md:hidden">
          <ThemeToggle label={dictionary.header.themeLabel} />
          <MobileNavSheet
            locale={locale}
            localeNames={dictionary.localeNames}
            menuLabel={dictionary.header.openMenu}
            themeLabel={dictionary.header.themeLabel}
            languageLabel={dictionary.header.languageLabel}
            title={dictionary.header.brand}
            description={dictionary.meta.description}
            navItems={navItems}
            primaryAction={primaryAction}
            secondaryAction={secondaryAction}
          />
        </div>
      </div>
    </header>
  );
}

interface HeaderButtonProps {
  action: HeaderAction;
  locale: AppLocale;
  variant: "primary" | "outline";
}

function HeaderButton({ action, locale, variant }: HeaderButtonProps) {
  const href = action.external ? action.href : localizeHref(locale, action.href);

  return (
    <Button asChild variant={variant} size="sm">
      <Link
        href={href}
        target={action.external ? "_blank" : undefined}
        rel={action.external ? "noreferrer" : undefined}
      >
        {action.label}
        {action.external ? <ArrowUpRight className="size-4" /> : null}
      </Link>
    </Button>
  );
}
