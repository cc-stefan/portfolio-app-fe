"use client";

import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { AppLocale } from "../i18n/routing";
import { localizeHref } from "../i18n/routing";
import type { PortfolioDictionary } from "../i18n/types";
import { LocaleSwitcher } from "./locale-switcher";

interface MobileNavSheetProps {
  locale: AppLocale;
  localeNames: PortfolioDictionary["localeNames"];
  menuLabel: string;
  themeLabel: string;
  languageLabel: string;
  title: string;
  description: string;
  navItems: Array<{ href: string; label: string }>;
  primaryAction?: { href: string; label: string; external?: boolean };
  secondaryAction?: { href: string; label: string; external?: boolean };
  triggerClassName?: string;
}

export function MobileNavSheet({
  locale,
  localeNames,
  menuLabel,
  languageLabel,
  title,
  description,
  navItems,
  primaryAction,
  secondaryAction,
  triggerClassName,
}: MobileNavSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={cn("md:hidden", triggerClassName)}
          aria-label={menuLabel}
        >
          <Menu className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="gap-7">
        <div className="space-y-2 pr-10">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </div>

        <LocaleSwitcher
          locale={locale}
          localeNames={localeNames}
          label={languageLabel}
          className="w-full justify-between"
        />

        <nav className="grid gap-2" aria-label={menuLabel}>
          {navItems.map((item) => (
            <SheetClose key={item.href} asChild>
              <Link
                href={localizeHref(locale, item.href)}
                className="rounded-xl border border-border bg-secondary px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/45"
              >
                {item.label}
              </Link>
            </SheetClose>
          ))}
        </nav>

        <div className="mt-auto grid gap-3">
          {secondaryAction ? (
            <ActionLink action={secondaryAction} locale={locale} variant="outline" />
          ) : null}
          {primaryAction ? (
            <ActionLink action={primaryAction} locale={locale} variant="primary" />
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface ActionLinkProps {
  action: { href: string; label: string; external?: boolean };
  locale: AppLocale;
  variant: "primary" | "outline";
}

function ActionLink({ action, locale, variant }: ActionLinkProps) {
  const href = action.external ? action.href : localizeHref(locale, action.href);

  return (
    <SheetClose asChild>
      <Button asChild variant={variant} size="lg" className="w-full">
        <Link
          href={href}
          target={action.external ? "_blank" : undefined}
          rel={action.external ? "noreferrer" : undefined}
        >
          {action.label}
          {action.external ? <ArrowUpRight className="size-4" /> : null}
        </Link>
      </Button>
    </SheetClose>
  );
}
