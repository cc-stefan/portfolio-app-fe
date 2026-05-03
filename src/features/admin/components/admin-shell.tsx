"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowUpRight,
  Bell,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ThemeToggle } from "@/features/portfolio/components/theme-toggle";
import { localizeHref, type AppLocale } from "@/features/portfolio/i18n/routing";
import { getBackendDocsUrl, shouldExposeBackendDocs } from "@/lib/backend";
import { cn } from "@/lib/utils";
import { AdminMobileNavSheet } from "./admin-mobile-nav-sheet";
import { useAdminAuth } from "../auth/use-admin-auth";
import { ADMIN_INQUIRIES_UPDATED_EVENT } from "../lib/inquiry-events";
import type { AdminInquiry } from "../model/types";

interface AdminShellProps {
  lang: AppLocale;
  children: React.ReactNode;
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

function isNavItemActive(pathname: string, href: string, lang: AppLocale) {
  const localizedHref = localizeHref(lang, href);

  if (href === "/admin") {
    return pathname === localizedHref;
  }

  return (
    pathname === localizedHref || pathname.startsWith(`${localizedHref}/`)
  );
}

export function AdminShell({ lang, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { authFetch, logout, user } = useAdminAuth();
  const [unreadInquiryCount, setUnreadInquiryCount] = useState<number | null>(null);
  const activeNavItem =
    navItems.find((item) => isNavItemActive(pathname, item.href, lang)) ??
    navItems[0];

  const loadUnreadInquiryCount = useCallback(async () => {
    const response = await authFetch("/admin/inquiries");

    if (!response.ok) {
      setUnreadInquiryCount(0);
      return;
    }

    const payload = (await response.json()) as AdminInquiry[];
    setUnreadInquiryCount(payload.filter((inquiry) => !inquiry.isRead).length);
  }, [authFetch]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadUnreadInquiryCount();
    }, 0);

    const handleInquiryUpdate = () => {
      void loadUnreadInquiryCount();
    };

    window.addEventListener(
      ADMIN_INQUIRIES_UPDATED_EVENT,
      handleInquiryUpdate,
    );

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener(
        ADMIN_INQUIRIES_UPDATED_EVENT,
        handleInquiryUpdate,
      );
    };
  }, [loadUnreadInquiryCount]);

  async function handleLogout() {
    await logout();
    router.replace(localizeHref(lang, "/admin/login"));
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-3 z-40 sm:top-5">
        <div className="container-page">
          <div className="surface-card rounded-2xl px-3 py-3 sm:px-4">
            <div className="flex items-center gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Link
                  href={localizeHref(lang, "/admin")}
                  className="group flex min-w-0 items-center gap-3 rounded-xl pr-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/45"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-foreground text-xs font-semibold text-background transition-transform duration-200 group-hover:scale-95">
                    P
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-foreground">
                      Portfolio Admin
                    </span>
                  </span>
                </Link>
              </div>

              <NavigationMenu className="ml-4 hidden lg:flex">
                <NavigationMenuList className="rounded-xl border border-border bg-background/70 p-1">
                  {navItems.map((item) => {
                    const isActive = isNavItemActive(pathname, item.href, lang);
                    const Icon = item.icon;

                    return (
                      <NavigationMenuItem key={item.href}>
                        <NavigationMenuLink
                          asChild
                          className={cn(
                            "inline-flex items-center gap-2",
                            isActive
                              ? "bg-secondary text-foreground shadow-sm"
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                          )}
                        >
                          <Link href={localizeHref(lang, item.href)}>
                            <Icon className="size-4" />
                            {item.label}
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>

              <div className="ml-auto hidden items-center gap-2 lg:flex">
                {user ? (
                  <div className="hidden min-w-0 items-center gap-3 rounded-xl border border-border bg-background/70 px-3 py-2 xl:flex">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {user.email}
                      </p>
                    </div>
                    <Badge variant="accent">{user.role}</Badge>
                  </div>
                ) : null}

                <Button asChild variant="ghost" size="sm">
                  <Link href={localizeHref(lang, "/")}>Public site</Link>
                </Button>
                {shouldExposeBackendDocs() ? (
                  <Button asChild variant="ghost" size="sm">
                    <Link href={getBackendDocsUrl()} target="_blank" rel="noreferrer">
                      API docs
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                ) : null}
                <Button asChild variant="outline" size="icon" className="relative">
                  <Link
                    href={localizeHref(lang, "/admin/inquiries")}
                    aria-label="Unread inquiries"
                  >
                    <Bell className="size-4" />
                    {unreadInquiryCount && unreadInquiryCount > 0 ? (
                      <span className="absolute -right-1.5 -top-1.5 flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                        {unreadInquiryCount}
                      </span>
                    ) : null}
                  </Link>
                </Button>
                <ThemeToggle label="Theme" />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void handleLogout()}
                >
                  <LogOut className="size-4" />
                  Sign out
                </Button>
              </div>

              <div className="ml-auto flex items-center gap-2 lg:hidden">
                <Badge variant="neutral" className="hidden sm:inline-flex">
                  {activeNavItem.label}
                </Badge>
                <AdminMobileNavSheet
                  lang={lang}
                  user={user}
                  activeHref={activeNavItem.href}
                  activeLabel={activeNavItem.label}
                  unreadInquiryCount={unreadInquiryCount ?? 0}
                  onLogout={handleLogout}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container-page py-6 sm:py-8">
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
