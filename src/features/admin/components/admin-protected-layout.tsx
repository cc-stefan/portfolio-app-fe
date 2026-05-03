"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteFooter } from "@/features/portfolio/components/site-footer";
import { StateCard } from "@/features/portfolio/components/state-card";
import { localizeHref, type AppLocale } from "@/features/portfolio/i18n/routing";
import type { PortfolioDictionary } from "@/features/portfolio/i18n/types";
import { getPortfolioHomeSectionLinks } from "@/features/portfolio/lib/portfolio-navigation";
import { AdminShell } from "./admin-shell";
import { useAdminAuth } from "../auth/use-admin-auth";

interface AdminProtectedLayoutProps {
  lang: AppLocale;
  dictionary: PortfolioDictionary;
  children: React.ReactNode;
}

export function AdminProtectedLayout({
  lang,
  dictionary,
  children,
}: AdminProtectedLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { clearAccessDenied, logout, status } = useAdminAuth();
  const footerNavItems = getPortfolioHomeSectionLinks(dictionary);

  useEffect(() => {
    if (status === "unauthenticated") {
      const loginHref = localizeHref(
        lang,
        `/admin/login?next=${encodeURIComponent(pathname)}`,
      );
      router.replace(loginHref);
    }
  }, [lang, pathname, router, status]);

  if (status === "loading") {
    return (
      <div className="page-shell">
        <div className="container-page flex min-h-screen flex-col py-4 sm:py-6">
          <div className="flex-1 space-y-4 py-10 sm:py-12">
            <Skeleton className="h-10 w-52" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-72 w-full" />
          </div>
          <SiteFooter
            locale={lang}
            dictionary={dictionary}
            navItems={footerNavItems}
          />
        </div>
      </div>
    );
  }

  if (status === "access-denied") {
    return (
      <div className="page-shell">
        <div className="container-page flex min-h-screen flex-col py-4 sm:py-6">
          <div className="flex flex-1 items-center py-16">
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
                      router.replace(localizeHref(lang, "/admin/login"));
                    }}
                  >
                    {dictionary.admin.signInWithAnotherAccount}
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href={localizeHref(lang, "/")}>
                      {dictionary.admin.backToPortfolio}
                    </Link>
                  </Button>
                </div>
              }
            />
          </div>
          <SiteFooter
            locale={lang}
            dictionary={dictionary}
            navItems={footerNavItems}
          />
        </div>
      </div>
    );
  }

  if (status !== "authenticated") {
    return <div className="min-h-screen" />;
  }

  return (
    <AdminShell lang={lang} dictionary={dictionary}>
      {children}
    </AdminShell>
  );
}
