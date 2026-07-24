'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SiteFooter } from '@/features/portfolio/components/site-footer';
import { StateCard } from '@/features/portfolio/components/state-card';
import { localizeHref, type AppLocale } from '@/features/portfolio/i18n/routing';
import type { PortfolioDictionary } from '@/features/portfolio/i18n/types';
import { getPortfolioHomeSectionLinks } from '@/features/portfolio/lib/portfolio-navigation';
import { AdminShell } from './admin-shell';
import { AdminLoadingHeader, AdminLoadingPanel } from './admin-loading-primitives';
import { useAdminAuth } from '../auth/use-admin-auth';

interface AdminProtectedLayoutProps {
  lang: AppLocale;
  dictionary: PortfolioDictionary;
  children: React.ReactNode;
}

export function AdminProtectedLayout({ lang, dictionary, children }: AdminProtectedLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { clearAccessDenied, logout, status } = useAdminAuth();
  const footerNavItems = getPortfolioHomeSectionLinks(dictionary);

  useEffect(() => {
    if (status === 'unauthenticated') {
      const loginHref = localizeHref(lang, `/admin/login?next=${encodeURIComponent(pathname)}`);
      router.replace(loginHref);
    }
  }, [lang, pathname, router, status]);

  if (status === 'loading') {
    return (
      <div className="page-shell">
        <div className="container-page flex min-h-[var(--app-viewport-height)] flex-col pb-[calc(1rem_+_var(--safe-area-inset-bottom))] pt-4 sm:pb-[calc(1.5rem_+_var(--safe-area-inset-bottom))] sm:pt-6">
          <div className="safe-content-frame flex flex-1 flex-col">
            <main className="flex-1 space-y-6 pb-6 pt-[var(--main-content-offset)] sm:pb-8">
              <AdminLoadingHeader className="page-enter" />
              <div className="page-enter grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <AdminLoadingPanel>
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-48 w-full rounded-2xl" />
                  </div>
                </AdminLoadingPanel>
                <AdminLoadingPanel>
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <Skeleton key={index} className="h-16 w-full rounded-xl" />
                      ))}
                    </div>
                  </div>
                </AdminLoadingPanel>
              </div>
            </main>
            <SiteFooter locale={lang} dictionary={dictionary} navItems={footerNavItems} />
          </div>
        </div>
        <div className="safe-header-layer pointer-events-none fixed inset-x-0 top-0 z-40">
          <div className="container-page">
            <div className="pointer-events-auto page-enter surface-card rounded-lg px-3 py-2.5 shadow-[var(--surface-shadow-lg)] sm:px-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Skeleton className="size-10 rounded-lg" />
                  <Skeleton className="h-5 w-36" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="hidden h-9 w-24 sm:block" />
                  <Skeleton className="h-9 w-10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'access-denied') {
    return (
      <div className="page-shell">
        <div className="container-page flex min-h-[var(--app-viewport-height)] flex-col py-4 sm:py-6">
          <div className="flex flex-1 items-center py-16">
            <div className="page-enter">
              <StateCard
                eyebrow={dictionary.admin.accessDeniedEyebrow}
                title={dictionary.admin.accessDeniedTitle}
                description={dictionary.admin.accessDeniedDescription}
                tone="warning"
                action={
                  <div className="flex flex-wrap gap-3">
                    <Button
                      type="button"
                      size="lg"
                      onClick={async () => {
                        clearAccessDenied();
                        await logout();
                        router.replace(localizeHref(lang, '/admin/login'));
                      }}
                    >
                      {dictionary.admin.signInWithAnotherAccount}
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href={localizeHref(lang, '/')}>{dictionary.admin.backToPortfolio}</Link>
                    </Button>
                  </div>
                }
              />
            </div>
          </div>
          <SiteFooter locale={lang} dictionary={dictionary} navItems={footerNavItems} />
        </div>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return <div className="min-h-[var(--app-viewport-height)]" />;
  }

  return (
    <AdminShell lang={lang} dictionary={dictionary}>
      {children}
    </AdminShell>
  );
}
