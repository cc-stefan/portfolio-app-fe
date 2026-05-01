"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Bell,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/features/portfolio/components/theme-toggle";
import { localizeHref, type AppLocale } from "@/features/portfolio/i18n/routing";
import { getBackendDocsUrl } from "@/lib/backend";
import { cn } from "@/lib/utils";
import type { AdminUser } from "../model/types";

interface AdminMobileNavSheetProps {
  lang: AppLocale;
  user: AdminUser | null;
  activeHref: string;
  activeLabel: string;
  unreadInquiryCount: number;
  onLogout: () => Promise<void>;
}

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/projects",
    label: "Projects",
    icon: FolderKanban,
  },
  {
    href: "/admin/inquiries",
    label: "Inquiries",
    icon: Inbox,
  },
] as const;

export function AdminMobileNavSheet({
  lang,
  user,
  activeHref,
  activeLabel,
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
          aria-label="Open admin menu"
        >
          <Menu className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="gap-7">
        <div className="space-y-2 pr-10">
          <SheetTitle>Portfolio Admin</SheetTitle>
          <SheetDescription>
            Manage projects and backend admin actions from a single menu.
          </SheetDescription>
        </div>

        <div className="rounded-2xl border border-border bg-secondary/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Current view
          </p>
          <div className="mt-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {activeLabel}
              </p>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {user?.email ?? "Admin account"}
              </p>
            </div>
            {user ? <Badge variant="accent">{user.role}</Badge> : null}
          </div>
        </div>

        <SheetClose asChild>
          <Link
            href={localizeHref(lang, "/admin/inquiries")}
            className="flex items-center justify-between rounded-xl border border-border bg-background/70 px-4 py-3 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/45"
          >
            <span className="inline-flex items-center gap-3 text-sm font-medium text-foreground">
              <Bell className="size-4" />
              Unread inquiries
            </span>
            <Badge variant={unreadInquiryCount > 0 ? "accent" : "outline"}>
              {unreadInquiryCount}
            </Badge>
          </Link>
        </SheetClose>

        <nav className="grid gap-2" aria-label="Admin menu">
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
                    <Icon className="size-4" />
                    {item.label}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    {item.href === "/admin/inquiries" ? (
                      <Badge variant={unreadInquiryCount > 0 ? "accent" : "outline"}>
                        {unreadInquiryCount}
                      </Badge>
                    ) : null}
                    {isActive ? <Badge variant="accent">Active</Badge> : null}
                  </span>
                </Link>
              </SheetClose>
            );
          })}
        </nav>

        <div className="grid gap-3">
          <ActionLink
            lang={lang}
            href="/"
            label="Public site"
            variant="outline"
          />
          <ActionLink
            lang={lang}
            href={getBackendDocsUrl()}
            label="API docs"
            external
            variant="outline"
          />
        </div>

        <div className="mt-auto grid gap-3">
          <div className="flex items-center justify-between rounded-xl border border-border bg-secondary px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Theme</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Toggle light and dark modes.
              </p>
            </div>
            <ThemeToggle label="Theme" className="shrink-0" />
          </div>

          <SheetClose asChild>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full justify-between"
              onClick={() => void onLogout()}
            >
              Sign out
              <LogOut className="size-4" />
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
  external?: boolean;
  variant: "primary" | "outline";
}

function ActionLink({
  lang,
  href,
  label,
  external = false,
  variant,
}: ActionLinkProps) {
  const resolvedHref = external ? href : localizeHref(lang, href);

  return (
    <SheetClose asChild>
      <Button asChild variant={variant} size="lg" className="w-full justify-between">
        <Link
          href={resolvedHref}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
        >
          {label}
          {external ? <ArrowUpRight className="size-4" /> : null}
        </Link>
      </Button>
    </SheetClose>
  );
}
