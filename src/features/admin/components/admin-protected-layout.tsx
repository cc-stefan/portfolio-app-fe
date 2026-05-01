"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StateCard } from "@/features/portfolio/components/state-card";
import { localizeHref, type AppLocale } from "@/features/portfolio/i18n/routing";
import { AdminShell } from "./admin-shell";
import { useAdminAuth } from "../auth/use-admin-auth";

interface AdminProtectedLayoutProps {
  lang: AppLocale;
  children: React.ReactNode;
}

export function AdminProtectedLayout({
  lang,
  children,
}: AdminProtectedLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { clearAccessDenied, logout, status } = useAdminAuth();

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
      <div className="container-page space-y-4 py-10">
        <Skeleton className="h-10 w-52" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (status === "access-denied") {
    return (
      <div className="container-page flex min-h-[70vh] items-center py-16">
        <StateCard
          eyebrow="Admin"
          title="Access denied"
          description="This account does not have permission to use the admin back office."
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
                Sign in with another account
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={localizeHref(lang, "/")}>Back to portfolio</Link>
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  if (status !== "authenticated") {
    return <div className="min-h-screen" />;
  }

  return <AdminShell lang={lang}>{children}</AdminShell>;
}
