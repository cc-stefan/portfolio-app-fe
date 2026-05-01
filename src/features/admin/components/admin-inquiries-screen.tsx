"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpRight, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { dispatchAdminInquiriesUpdated } from "../lib/inquiry-events";
import type { AdminInquiry, InquiryStatus } from "../model/types";
import { useAdminAuth } from "../auth/use-admin-auth";

interface AdminInquiriesScreenProps {
  lang: AppLocale;
}

const statusOrder: InquiryStatus[] = [
  "NEW",
  "IN_REVIEW",
  "RESOLVED",
  "ARCHIVED",
];

export function AdminInquiriesScreen({ lang }: AdminInquiriesScreenProps) {
  const { authFetch, status } = useAdminAuth();
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingInquiryId, setPendingInquiryId] = useState<string | null>(null);

  const formatDate = useMemo(
    () => (value: string) =>
      new Intl.DateTimeFormat(localeTags[lang], {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(value)),
    [lang],
  );

  const stats = useMemo(
    () => ({
      total: inquiries.length,
      unreadCount: inquiries.filter((inquiry) => !inquiry.isRead).length,
      inReviewCount: inquiries.filter((inquiry) => inquiry.status === "IN_REVIEW")
        .length,
      resolvedCount: inquiries.filter((inquiry) => inquiry.status === "RESOLVED")
        .length,
    }),
    [inquiries],
  );

  const loadInquiries = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await authFetch("/admin/inquiries");

    if (!response.ok) {
      if (response.status !== 401 && response.status !== 403) {
        const errorBody = await readBackendError(response);
        setError(
          getBackendErrorMessage(
            errorBody,
            "Unable to load admin inquiries",
          ),
        );
      }

      setLoading(false);
      return;
    }

    const payload = (await response.json()) as AdminInquiry[];
    setInquiries(payload);
    setLoading(false);
  }, [authFetch]);

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void loadInquiries();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadInquiries, status]);

  async function patchInquiry(
    inquiryId: string,
    payload: { isRead?: boolean; status?: InquiryStatus },
    successMessage: string,
  ) {
    setPendingInquiryId(inquiryId);

    const response = await authFetch(`/admin/inquiries/${inquiryId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await readBackendError(response);
      toast.error(
        getBackendErrorMessage(errorBody, "Unable to update this inquiry"),
      );
      setPendingInquiryId(null);
      return;
    }

    toast.success(successMessage);
    dispatchAdminInquiriesUpdated();
    await loadInquiries();
    setPendingInquiryId(null);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-10 w-52" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28" />
          ))}
        </div>
        <div className="grid gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <StateCard
        eyebrow="Inquiries"
        title="Unable to load inquiries"
        description={error}
        tone="warning"
        action={
          <Button type="button" size="lg" onClick={() => void loadInquiries()}>
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
            Admin inquiries
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
            Review contact submissions
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
            Track public contact form submissions, update their status, and keep internal follow-up notes in one place.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href={localizeHref(lang, "/admin")}>Back to dashboard</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total inquiries" value={stats.total} />
        <StatCard label="Unread" value={stats.unreadCount} tone="accent" />
        <StatCard label="In review" value={stats.inReviewCount} />
        <StatCard label="Resolved" value={stats.resolvedCount} tone="success" />
      </section>

      {inquiries.length === 0 ? (
        <StateCard
          eyebrow="Inquiries"
          title="No inquiries yet"
          description="Public contact submissions will appear here after the backend inquiry endpoints are live."
        />
      ) : (
        <section className="grid gap-4">
          {inquiries
            .slice()
            .sort(
              (left, right) =>
                Number(left.isRead) - Number(right.isRead) ||
                statusOrder.indexOf(left.status) - statusOrder.indexOf(right.status) ||
                new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
            )
            .map((inquiry) => (
              <Card key={inquiry.id} variant="solid">
                <CardContent className="grid gap-4 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_15rem]">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          href={localizeHref(lang, `/admin/inquiries/${inquiry.id}`)}
                          className="inline-flex items-center gap-2 text-lg font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/45"
                        >
                          <span className="truncate">{inquiry.name}</span>
                          <ArrowUpRight className="size-4 shrink-0" />
                        </Link>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {inquiry.email}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={inquiry.isRead ? "outline" : "accent"}>
                          {inquiry.isRead ? "Read" : "Unread"}
                        </Badge>
                        <Badge variant={getInquiryBadgeVariant(inquiry.status)}>
                          {formatInquiryStatus(inquiry.status)}
                        </Badge>
                      </div>
                    </div>

                    <p className="mt-4 line-clamp-3 text-sm leading-7 text-muted-foreground">
                      {inquiry.message}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge variant="outline">
                        Received {formatDate(inquiry.createdAt)}
                      </Badge>
                      {inquiry.adminNotes?.trim() ? (
                        <Badge variant="neutral">Has notes</Badge>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid gap-2 rounded-xl border border-border bg-background/70 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      Actions
                    </p>
                    <Button asChild variant="outline" size="sm">
                      <Link href={localizeHref(lang, `/admin/inquiries/${inquiry.id}`)}>
                        Open inquiry
                      </Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href={`mailto:${inquiry.email}`}>Reply by email</Link>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={pendingInquiryId === inquiry.id}
                      onClick={() =>
                        void patchInquiry(
                          inquiry.id,
                          { isRead: !inquiry.isRead },
                          inquiry.isRead
                            ? "Inquiry marked as unread"
                            : "Inquiry marked as read",
                        )
                      }
                    >
                      {inquiry.isRead ? "Mark unread" : "Mark read"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </section>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "accent" | "success";
}) {
  const badgeVariant =
    tone === "accent" ? "accent" : tone === "success" ? "success" : "outline";

  return (
    <Card variant="solid">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <Badge variant={badgeVariant}>{tone === "default" ? "Signal" : tone}</Badge>
        </div>
        <p className="mt-6 text-3xl font-semibold text-foreground">{value}</p>
      </CardContent>
    </Card>
  );
}

function getInquiryBadgeVariant(status: InquiryStatus) {
  if (status === "RESOLVED") {
    return "success";
  }

  if (status === "NEW") {
    return "accent";
  }

  if (status === "ARCHIVED") {
    return "outline";
  }

  return "neutral";
}

function formatInquiryStatus(status: InquiryStatus) {
  return status
    .toLowerCase()
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}
