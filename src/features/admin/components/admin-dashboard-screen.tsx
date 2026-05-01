"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight, RefreshCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StateCard } from "@/features/portfolio/components/state-card";
import {
  localeTags,
  localizeHref,
  type AppLocale,
} from "@/features/portfolio/i18n/routing";
import {
  getBackendErrorMessage,
  readBackendError,
} from "../lib/backend-errors";
import { resolveProjectCoverImageUrl } from "../lib/project-form";
import type { AdminDashboardResponse, AdminUser } from "../model/types";
import { useAdminAuth } from "../auth/use-admin-auth";

interface AdminDashboardScreenProps {
  lang: AppLocale;
}

const statEntries = [
  ["totalProjects", "Total projects"],
  ["publishedProjects", "Published"],
  ["draftProjects", "Drafts"],
  ["featuredProjects", "Featured"],
  ["projectsWithImages", "With images"],
  ["totalUsers", "Total users"],
  ["adminUsers", "Admins"],
  ["regularUsers", "Users"],
] as const;

export function AdminDashboardScreen({ lang }: AdminDashboardScreenProps) {
  const { authFetch, status, user } = useAdminAuth();
  const [dashboard, setDashboard] = useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDate = useCallback(
    (value: string) =>
      new Intl.DateTimeFormat(localeTags[lang], {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(value)),
    [lang],
  );

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await authFetch("/admin/dashboard");

    if (!response.ok) {
      if (response.status !== 401 && response.status !== 403) {
        const errorBody = await readBackendError(response);
        setError(
          getBackendErrorMessage(
            errorBody,
            "Unable to load the admin dashboard",
          ),
        );
      }

      setLoading(false);
      return;
    }

    const payload = (await response.json()) as AdminDashboardResponse;
    setDashboard(payload);
    setLoading(false);
  }, [authFetch]);

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void loadDashboard();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadDashboard, status]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-10 w-52" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-30" />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <StateCard
        eyebrow="Dashboard"
        title="Unable to load admin data"
        description={error ?? "The dashboard did not return usable data."}
        tone="warning"
        action={
          <Button type="button" size="lg" onClick={() => void loadDashboard()}>
            <RefreshCcw className="size-4" />
            Retry
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Admin dashboard
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
            Portfolio operations
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
            Review project inventory, user counts, and recent activity from the live NestJS + Prisma backend.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="neutral">Signed in as {user?.email}</Badge>
          <Badge variant="outline">
            Generated {formatDate(dashboard.generatedAt)}
          </Badge>
          <Button asChild size="sm">
            <Link href={localizeHref(lang, "/admin/projects/new")}>
              New project
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statEntries.map(([key, label]) => (
          <Card key={key} variant="solid">
            <CardContent className="p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                {label}
              </p>
              <p className="mt-4 text-3xl font-semibold text-foreground">
                {dashboard.stats[key]}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card variant="solid">
          <CardHeader>
            <CardTitle>Recent projects</CardTitle>
            <CardDescription>
              The latest entries from the admin project feed.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {dashboard.recentProjects.length === 0 ? (
              <EmptyPanel
                title="No projects yet"
                description="Create a project in the admin area to populate the public portfolio."
              />
            ) : (
              dashboard.recentProjects.map((project) => {
                const coverImageUrl = resolveProjectCoverImageUrl(
                  project.coverImageUrl,
                );

                return (
                  <Link
                    key={project.id}
                    href={localizeHref(lang, `/admin/projects/${project.id}`)}
                    className="grid gap-4 rounded-xl border border-border bg-background/70 p-4 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/45 sm:grid-cols-[5rem_minmax(0,1fr)]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-secondary">
                      {coverImageUrl ? (
                        <Image
                          src={coverImageUrl}
                          alt={project.title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {project.title}
                          </p>
                          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                            {project.slug}
                          </p>
                        </div>
                        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant={project.published ? "success" : "warning"}>
                          {project.published ? "Published" : "Draft"}
                        </Badge>
                        {project.featured ? (
                          <Badge variant="accent">Featured</Badge>
                        ) : null}
                        <Badge variant="outline">
                          Updated {formatDate(project.updatedAt)}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card variant="solid">
          <CardHeader>
            <CardTitle>Recent users</CardTitle>
            <CardDescription>
              Most recently created accounts from the auth system.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {dashboard.recentUsers.length === 0 ? (
              <EmptyPanel
                title="No users yet"
                description="User records will appear here as soon as the backend has accounts."
              />
            ) : (
              dashboard.recentUsers.map((account) => (
                <RecentUserRow
                  key={account.id}
                  account={account}
                  formatDate={formatDate}
                />
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function EmptyPanel({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/70 p-5">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function RecentUserRow({
  account,
  formatDate,
}: {
  account: AdminUser;
  formatDate: (value: string) => string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/70 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {account.email}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {[account.firstName, account.lastName].filter(Boolean).join(" ") || "No profile name"}
          </p>
        </div>
        <Badge variant={account.role === "ADMIN" ? "accent" : "neutral"}>
          {account.role}
        </Badge>
      </div>
      <p className="mt-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
        Created {formatDate(account.createdAt)}
      </p>
    </div>
  );
}
