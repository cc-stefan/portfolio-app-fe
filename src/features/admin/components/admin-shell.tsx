'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { FolderKanban, Inbox, LayoutDashboard, LogOut, type LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { LocaleSwitcher } from '@/features/portfolio/components/locale-switcher';
import { SiteFooter } from '@/features/portfolio/components/site-footer';
import { ThemeToggle } from '@/features/portfolio/components/theme-toggle';
import { localizeHref, type AppLocale } from '@/features/portfolio/i18n/routing';
import type { PortfolioDictionary } from '@/features/portfolio/i18n/types';
import { getPortfolioHomeSectionLinks } from '@/features/portfolio/lib/portfolio-navigation';
import { cn } from '@/lib/utils';
import { AdminMobileNavSheet } from './admin-mobile-nav-sheet';
import { useAdminAuth } from '../auth/use-admin-auth';
import { ADMIN_INQUIRIES_UPDATED_EVENT } from '../lib/inquiry-events';
import type { AdminInquiry } from '../model/types';

interface AdminShellProps {
  lang: AppLocale;
  dictionary: PortfolioDictionary;
  children: React.ReactNode;
}

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

function isNavItemActive(pathname: string, href: string, lang: AppLocale) {
  const localizedHref = localizeHref(lang, href);

  if (href === '/admin') {
    return pathname === localizedHref;
  }

  return pathname === localizedHref || pathname.startsWith(`${localizedHref}/`);
}

export function AdminShell({ lang, dictionary, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { authFetch, logout, user } = useAdminAuth();
  const [unreadInquiryCount, setUnreadInquiryCount] = useState<number | null>(null);
  const navItems: AdminNavItem[] = [
    {
      href: '/admin',
      label: dictionary.admin.navDashboard,
      icon: LayoutDashboard,
    },
    {
      href: '/admin/projects',
      label: dictionary.admin.navProjects,
      icon: FolderKanban,
    },
    {
      href: '/admin/inquiries',
      label: dictionary.admin.navInquiries,
      icon: Inbox,
    },
  ];
  const activeNavItem =
    navItems.find((item) => isNavItemActive(pathname, item.href, lang)) ?? navItems[0];
  const footerNavItems = getPortfolioHomeSectionLinks(dictionary);

  const loadUnreadInquiryCount = useCallback(async () => {
    const response = await authFetch('/admin/inquiries');

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

    window.addEventListener(ADMIN_INQUIRIES_UPDATED_EVENT, handleInquiryUpdate);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener(ADMIN_INQUIRIES_UPDATED_EVENT, handleInquiryUpdate);
    };
  }, [loadUnreadInquiryCount]);

  async function handleLogout() {
    await logout();
    router.replace(localizeHref(lang, '/admin/login'));
  }

  return (
    <div className="page-shell">
      <div
        className="pointer-events-none fixed inset-x-0 z-40"
        style={{ top: 'calc(var(--safe-area-inset-top) + var(--header-offset))' }}
      >
        <div className="container-page">
          <header className="pointer-events-auto page-enter surface-card rounded-lg px-3 py-2.5 shadow-[var(--surface-shadow-lg)] sm:px-4">
            <div className="flex items-center gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Link
                  href={localizeHref(lang, '/admin')}
                  className="group flex min-w-0 items-center gap-3 rounded-lg pr-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/45"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary text-xs font-semibold text-primary-foreground shadow-[var(--primary-shadow)] transition-transform duration-200 group-hover:scale-95">
                    CCS
                  </span>
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {dictionary.admin.brand}
                  </span>
                </Link>
              </div>

              <NavigationMenu
                className="ml-4 hidden lg:flex"
                aria-label={dictionary.admin.navigationLabel}
              >
                <NavigationMenuList className="rounded-xl border border-border bg-background/70 p-1">
                  {navItems.map((item) => {
                    const isActive = isNavItemActive(pathname, item.href, lang);
                    const Icon = item.icon;
                    const showInquiryBadge =
                      item.href === '/admin/inquiries' &&
                      unreadInquiryCount !== null &&
                      unreadInquiryCount > 0;

                    return (
                      <NavigationMenuItem key={item.href}>
                        <NavigationMenuLink
                          asChild
                          className={cn(
                            'inline-flex items-center gap-2',
                            isActive
                              ? 'bg-secondary text-foreground shadow-sm'
                              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                          )}
                        >
                          <Link href={localizeHref(lang, item.href)}>
                            <Icon className="size-4" />
                            {item.label}
                            {showInquiryBadge ? (
                              <Badge variant="info" className="ml-1">
                                {unreadInquiryCount}
                              </Badge>
                            ) : null}
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>

              <div className="ml-auto hidden items-center gap-2 lg:flex">
                <Button asChild variant="ghost" size="sm">
                  <Link href={localizeHref(lang, '/')}>{dictionary.admin.viewSite}</Link>
                </Button>
                <LocaleSwitcher
                  locale={lang}
                  localeNames={dictionary.localeNames}
                  label={dictionary.header.languageLabel}
                />
                <ThemeToggle label={dictionary.header.themeLabel} />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void handleLogout()}
                >
                  <LogOut className="size-4" />
                  {dictionary.admin.signOut}
                </Button>
              </div>

              <div className="ml-auto flex items-center gap-2 lg:hidden">
                <Badge variant="neutral" className="hidden sm:inline-flex">
                  {activeNavItem.label}
                </Badge>
                <AdminMobileNavSheet
                  lang={lang}
                  dictionary={dictionary}
                  user={user}
                  navItems={navItems}
                  activeHref={activeNavItem.href}
                  unreadInquiryCount={unreadInquiryCount ?? 0}
                  onLogout={handleLogout}
                />
              </div>
            </div>
          </header>
        </div>
      </div>

      <div className="container-page flex min-h-[100svh] flex-col pb-[calc(1rem_+_var(--safe-area-inset-bottom))] pt-4 sm:pb-[calc(1.5rem_+_var(--safe-area-inset-bottom))] sm:pt-6">
        <div className="safe-content-frame flex flex-1 flex-col">
          <main className="min-w-0 flex-1 pb-6 pt-[var(--main-content-offset)] sm:pb-8">
            {children}
          </main>

          <SiteFooter locale={lang} dictionary={dictionary} navItems={footerNavItems} />
        </div>
      </div>
    </div>
  );
}
