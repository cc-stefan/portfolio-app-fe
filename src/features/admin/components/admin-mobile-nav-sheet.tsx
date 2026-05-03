"use client";

import Link from "next/link";
import {LogOut, Menu} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger,} from "@/components/ui/sheet";
import {LocaleSwitcher} from "@/features/portfolio/components/locale-switcher";
import {ThemeToggle} from "@/features/portfolio/components/theme-toggle";
import {type AppLocale, localizeHref} from "@/features/portfolio/i18n/routing";
import type {PortfolioDictionary} from "@/features/portfolio/i18n/types";
import {cn} from "@/lib/utils";
import type {AdminUser} from "../model/types";
import type {AdminNavItem} from "./admin-shell";

interface AdminMobileNavSheetProps {
  lang: AppLocale;
  dictionary: PortfolioDictionary;
  user: AdminUser | null;
  navItems: readonly AdminNavItem[];
  activeHref: string;
  unreadInquiryCount: number;
  onLogout: () => Promise<void>;
}

export function AdminMobileNavSheet({
                                      lang,
                                      dictionary,
                                      user,
                                      navItems,
                                      activeHref,
                                      unreadInquiryCount,
                                      onLogout,
                                    }: AdminMobileNavSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={dictionary.admin.openMenu}
        >
          <Menu className="size-4"/>
        </Button>
      </SheetTrigger>
      <SheetContent className="gap-7">
        <div className="space-y-2 pr-10">
          <SheetTitle>{dictionary.admin.brand}</SheetTitle>
          <SheetDescription className="sr-only">
            {dictionary.admin.brand}
          </SheetDescription>
        </div>

        {user ? (
          <div className="rounded-2xl border border-border bg-secondary/70 p-4">
            <p className="truncate text-sm font-medium text-foreground">
              {user.email}
            </p>
          </div>
        ) : null}

        <nav className="grid gap-2" aria-label={dictionary.admin.brand}>
          {navItems.map((item) => {
            const href = localizeHref(lang, item.href);
            const isActive = item.href === activeHref;
            const Icon = item.icon;

            return (
              <SheetClose key={item.href} asChild>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/45",
                    isActive
                      ? "border-primary/20 bg-primary/10 text-foreground"
                      : "border-border bg-secondary text-foreground hover:bg-muted",
                  )}
                >
                  <span className="inline-flex items-center gap-3">
                    <Icon className="size-4"/>
                    {item.label}
                  </span>
                  {item.href === "/admin/inquiries" ? (
                    <Badge variant={unreadInquiryCount > 0 ? "accent" : "outline"}>
                      {unreadInquiryCount}
                    </Badge>
                  ) : null}
                </Link>
              </SheetClose>
            );
          })}
        </nav>

        <div className="grid gap-3">
          <ActionLink
            lang={lang}
            href="/"
            label={dictionary.admin.viewSite}
            variant="outline"
          />
        </div>

        <div className="mt-auto grid gap-3">
          <div
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-secondary px-4 py-3">
            <span className="text-sm font-semibold text-foreground">
              {dictionary.header.languageLabel}
            </span>
            <LocaleSwitcher
              locale={lang}
              localeNames={dictionary.localeNames}
              label={dictionary.header.languageLabel}
              className="shrink-0"
            />
          </div>

          <div
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-secondary px-4 py-3">
            <span className="text-sm font-semibold text-foreground">
              {dictionary.header.themeLabel}
            </span>
            <ThemeToggle
              label={dictionary.header.themeLabel}
              className="shrink-0"
            />
          </div>

          <SheetClose asChild>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full justify-between"
              onClick={() => void onLogout()}
            >
              {dictionary.admin.signOut}
              <LogOut className="size-4"/>
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface ActionLinkProps {
  lang: AppLocale;
  href: string;
  label: string;
  variant: "primary" | "outline";
}

function ActionLink({lang, href, label, variant}: ActionLinkProps) {
  return (
    <SheetClose asChild>
      <Button asChild variant={variant} size="lg" className="w-full justify-between">
        <Link href={localizeHref(lang, href)}>{label}</Link>
      </Button>
    </SheetClose>
  );
}
