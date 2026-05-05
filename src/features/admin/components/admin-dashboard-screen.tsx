"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowUpRight,
  FolderKanban,
  Inbox,
  RefreshCcw,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
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
import {
  formatInquiryStatus,
  getInquiryBadgeVariant,
} from "../lib/inquiry-status";
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
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1.05fr)_minmax(0,0.9fr)]">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-80" />
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

  const projectRows = [
    {
      label: dictionary.admin.statPublishedProjects,
      value: dashboard.stats.publishedProjects,
      tone: "success",
    },
    {
      label: dictionary.admin.statDraftProjects,
      value: dashboard.stats.draftProjects,
      tone: "warning",
    },
    {
      label: dictionary.admin.statFeaturedProjects,
      value: dashboard.stats.featuredProjects,
      tone: "accent",
    },
    {
      label: dictionary.admin.statProjectsWithImages,
      value: dashboard.stats.projectsWithImages,
      tone: "neutral",
    },
  ] as const;
  const inquiryRows = [
    {
      label: dictionary.admin.statUnreadInquiries,
      value: inquiryStats.unread,
      tone: "accent",
    },
    {
      label: dictionary.admin.statInReviewInquiries,
      value: inquiryStats.inReview,
      tone: "warning",
    },
    {
      label: dictionary.admin.statResolvedInquiries,
      value: inquiryStats.resolved,
      tone: "success",
    },
  ] as const;
  const accessRows = [
    {
      label: dictionary.admin.statAdminUsers,
      value: dashboard.stats.adminUsers,
      tone: "neutral",
    },
    {
      label: dictionary.admin.statRegularUsers,
      value: dashboard.stats.regularUsers,
      tone: "neutral",
    },
  ] as const;

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

      <section className="grid gap-4 xl:grid-cols-3">
        <SummaryPanel
          icon={FolderKanban}
          title={dictionary.admin.dashboardGroups.projectsTitle}
          description={dictionary.admin.dashboardGroups.projectsDescription}
          totalLabel={dictionary.admin.statTotalProjects}
          totalValue={dashboard.stats.totalProjects}
          rows={projectRows}
        />
        <SummaryPanel
          icon={Inbox}
          title={dictionary.admin.dashboardGroups.inquiriesTitle}
          description={dictionary.admin.dashboardGroups.inquiriesDescription}
          totalLabel={dictionary.admin.statTotalInquiries}
          totalValue={inquiryStats.total}
          rows={inquiryRows}
        />
        <SummaryPanel
          icon={ShieldCheck}
          title={dictionary.admin.dashboardGroups.accessTitle}
          description={dictionary.admin.dashboardGroups.accessDescription}
          totalLabel={dictionary.admin.statTotalUsers}
          totalValue={dashboard.stats.totalUsers}
          rows={accessRows}
        />
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
            {formatInquiryStatus(inquiry.status, dictionary.admin)}
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

function SummaryPanel({
  icon: Icon,
  title,
  description,
  totalLabel,
  totalValue,
  rows,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  totalLabel: string;
  totalValue: number;
  rows: ReadonlyArray<{
    label: string;
    value: number;
    tone: "neutral" | "accent" | "warning" | "success";
  }>;
}) {
  return (
    <Card variant="solid">
      <CardHeader className="gap-4 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="max-w-md">{description}</CardDescription>
          </div>
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-primary">
            <Icon className="size-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="rounded-2xl border border-border bg-background/70 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            {totalLabel}
          </p>
          <p className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
            {totalValue}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background/40 px-4 py-3"
            >
              <Badge variant={row.tone}>{row.label}</Badge>
              <span className="text-lg font-semibold text-foreground">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
