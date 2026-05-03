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
import type { PortfolioDictionary } from "@/features/portfolio/i18n/types";
import {
  getBackendErrorMessage,
  readBackendError,
} from "../lib/backend-errors";
import { resolveProjectImageUrl } from "../lib/project-form";
import type { AdminDashboardResponse, AdminInquiry } from "../model/types";
import { useAdminAuth } from "../auth/use-admin-auth";

interface AdminDashboardScreenProps {
  lang: AppLocale;
  dictionary: PortfolioDictionary;
}

export function AdminDashboardScreen({
  lang,
  dictionary,
}: AdminDashboardScreenProps) {
  const { authFetch, status, user } = useAdminAuth();
  const [dashboard, setDashboard] = useState<AdminDashboardResponse | null>(
    null,
  );
  const [recentInquiries, setRecentInquiries] = useState<AdminInquiry[]>([]);
  const [inquiryStats, setInquiryStats] = useState({
    total: 0,
    unread: 0,
    inReview: 0,
    resolved: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const statEntries = [
    ["totalProjects", dictionary.admin.statTotalProjects],
    ["publishedProjects", dictionary.admin.statPublishedProjects],
    ["draftProjects", dictionary.admin.statDraftProjects],
    ["featuredProjects", dictionary.admin.statFeaturedProjects],
    ["projectsWithImages", dictionary.admin.statProjectsWithImages],
    ["totalUsers", dictionary.admin.statTotalUsers],
    ["adminUsers", dictionary.admin.statAdminUsers],
    ["regularUsers", dictionary.admin.statRegularUsers],
  ] as const;
  const inquiryStatEntries = [
    [dictionary.admin.statTotalInquiries, inquiryStats.total],
    [dictionary.admin.statUnreadInquiries, inquiryStats.unread],
    [dictionary.admin.statInReviewInquiries, inquiryStats.inReview],
    [dictionary.admin.statResolvedInquiries, inquiryStats.resolved],
  ] as const;

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

    const [dashboardResponse, inquiriesResponse] = await Promise.all([
      authFetch("/admin/dashboard"),
      authFetch("/admin/inquiries"),
    ]);

    if (!dashboardResponse.ok) {
      if (dashboardResponse.status !== 401 && dashboardResponse.status !== 403) {
        const errorBody = await readBackendError(dashboardResponse);
        setError(
          getBackendErrorMessage(
            errorBody,
            dictionary.admin.dashboardLoadErrorDescription,
          ),
        );
      }

      setLoading(false);
      return;
    }

    if (!inquiriesResponse.ok) {
      if (inquiriesResponse.status !== 401 && inquiriesResponse.status !== 403) {
        const errorBody = await readBackendError(inquiriesResponse);
        setError(
          getBackendErrorMessage(
            errorBody,
            dictionary.admin.dashboardLoadErrorDescription,
          ),
        );
      }

      setLoading(false);
      return;
    }

    const dashboardPayload =
      (await dashboardResponse.json()) as AdminDashboardResponse;
    const inquiriesPayload = (await inquiriesResponse.json()) as AdminInquiry[];

    setDashboard(dashboardPayload);
    setInquiryStats({
      total: inquiriesPayload.length,
      unread: inquiriesPayload.filter((inquiry) => !inquiry.isRead).length,
      inReview: inquiriesPayload.filter(
        (inquiry) => inquiry.status === "IN_REVIEW",
      ).length,
      resolved: inquiriesPayload.filter(
        (inquiry) => inquiry.status === "RESOLVED",
      ).length,
    });
    setRecentInquiries(
      inquiriesPayload
        .slice()
        .sort(
          (left, right) =>
            new Date(right.createdAt).getTime() -
            new Date(left.createdAt).getTime(),
        )
        .slice(0, 5),
    );
    setLoading(false);
  }, [authFetch, dictionary.admin.dashboardLoadErrorDescription]);

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
          {Array.from({ length: 12 }).map((_, index) => (
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
        eyebrow={dictionary.admin.dashboardLabel}
        title={dictionary.admin.dashboardLoadErrorTitle}
        description={error ?? dictionary.admin.dashboardLoadErrorDescription}
        tone="warning"
        action={
          <Button type="button" size="lg" onClick={() => void loadDashboard()}>
            <RefreshCcw className="size-4" />
            {dictionary.admin.retry}
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
            {dictionary.admin.dashboardLabel}
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
            {dictionary.admin.dashboardTitle}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
            {dictionary.admin.dashboardDescription}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {user?.email ? <Badge variant="neutral">{user.email}</Badge> : null}
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
        {inquiryStatEntries.map(([label, value]) => (
          <Card key={label} variant="solid">
            <CardContent className="p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                {label}
              </p>
              <p className="mt-4 text-3xl font-semibold text-foreground">
                {value}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card variant="solid">
          <CardHeader>
            <CardTitle>{dictionary.admin.recentProjectsTitle}</CardTitle>
            <CardDescription>
              {dictionary.admin.recentProjectsDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {dashboard.recentProjects.length === 0 ? (
              <EmptyPanel
                title={dictionary.admin.recentProjectsEmptyTitle}
                description={dictionary.admin.recentProjectsEmptyDescription}
              />
            ) : (
              dashboard.recentProjects.map((project) => {
                const imageUrl = resolveProjectImageUrl(project.imageUrl);

                return (
                  <Link
                    key={project.id}
                    href={localizeHref(lang, `/admin/projects/${project.id}`)}
                    className="grid gap-4 rounded-xl border border-border bg-background/70 p-4 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/45 sm:grid-cols-[5rem_minmax(0,1fr)]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-secondary">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
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
                        <Badge
                          variant={project.published ? "success" : "warning"}
                        >
                          {project.published
                            ? dictionary.admin.published
                            : dictionary.admin.draft}
                        </Badge>
                        {project.featured ? (
                          <Badge variant="accent">
                            {dictionary.admin.featured}
                          </Badge>
                        ) : null}
                        <Badge variant="outline">
                          {dictionary.admin.updated}{" "}
                          {formatDate(project.updatedAt)}
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
            <CardTitle>{dictionary.admin.recentInquiriesTitle}</CardTitle>
            <CardDescription>
              {dictionary.admin.recentInquiriesDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {recentInquiries.length === 0 ? (
              <EmptyPanel
                title={dictionary.admin.recentInquiriesEmptyTitle}
                description={dictionary.admin.recentInquiriesEmptyDescription}
              />
            ) : (
              recentInquiries.map((inquiry) => (
                <RecentInquiryRow
                  key={inquiry.id}
                  inquiry={inquiry}
                  lang={lang}
                  dictionary={dictionary}
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

function RecentInquiryRow({
  inquiry,
  lang,
  dictionary,
  formatDate,
}: {
  inquiry: AdminInquiry;
  lang: AppLocale;
  dictionary: PortfolioDictionary;
  formatDate: (value: string) => string;
}) {
  return (
    <Link
      href={localizeHref(lang, `/admin/inquiries/${inquiry.id}`)}
      className="block rounded-xl border border-border bg-background/70 p-4 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/45"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {inquiry.name}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {inquiry.email}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={inquiry.isRead ? "outline" : "accent"}>
            {inquiry.isRead ? dictionary.admin.read : dictionary.admin.unread}
          </Badge>
          <Badge variant={getInquiryBadgeVariant(inquiry.status)}>
            {formatInquiryStatus(inquiry.status, dictionary)}
          </Badge>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
        {inquiry.message}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge variant="outline">
          {dictionary.admin.received} {formatDate(inquiry.createdAt)}
        </Badge>
        {inquiry.adminNotes?.trim() ? (
          <Badge variant="neutral">{dictionary.admin.hasNotes}</Badge>
        ) : null}
      </div>
    </Link>
  );
}

function getInquiryBadgeVariant(status: AdminInquiry["status"]) {
  if (status === "RESOLVED") {
    return "success";
  }

  if (status === "NEW") {
    return "accent";
  }

  if (status === "IN_REVIEW") {
    return "warning";
  }

  if (status === "ARCHIVED") {
    return "outline";
  }

  return "neutral";
}

function formatInquiryStatus(
  status: AdminInquiry["status"],
  dictionary: PortfolioDictionary,
) {
  if (status === "NEW") {
    return dictionary.admin.inquiryStatusNew;
  }

  if (status === "IN_REVIEW") {
    return dictionary.admin.inquiryStatusInReview;
  }

  if (status === "RESOLVED") {
    return dictionary.admin.inquiryStatusResolved;
  }

  return dictionary.admin.inquiryStatusArchived;
}
