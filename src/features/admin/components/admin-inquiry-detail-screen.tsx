"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, RefreshCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
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
import type {
  AdminInquiry,
  InquiryMutationPayload,
  InquiryStatus,
} from "../model/types";
import { useAdminAuth } from "../auth/use-admin-auth";

interface AdminInquiryDetailScreenProps {
  lang: AppLocale;
  inquiryId: string;
}

const statusOptions: InquiryStatus[] = [
  "NEW",
  "IN_REVIEW",
  "RESOLVED",
  "ARCHIVED",
];

export function AdminInquiryDetailScreen({
  lang,
  inquiryId,
}: AdminInquiryDetailScreenProps) {
  const router = useRouter();
  const { authFetch, status } = useAdminAuth();
  const [inquiry, setInquiry] = useState<AdminInquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [readToggling, setReadToggling] = useState(false);
  const [statusValue, setStatusValue] = useState<InquiryStatus>("NEW");
  const [notesValue, setNotesValue] = useState("");

  const formatDate = useMemo(
    () => (value: string) =>
      new Intl.DateTimeFormat(localeTags[lang], {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(value)),
    [lang],
  );

  const applyInquiry = useCallback((payload: AdminInquiry) => {
    setInquiry(payload);
    setStatusValue(payload.status);
    setNotesValue(payload.adminNotes ?? "");
  }, []);

  const loadInquiry = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);

    const response = await authFetch(`/admin/inquiries/${inquiryId}`);

    if (response.status === 404) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    if (!response.ok) {
      if (response.status !== 401 && response.status !== 403) {
        const errorBody = await readBackendError(response);
        setError(
          getBackendErrorMessage(errorBody, "Unable to load this inquiry"),
        );
      }

      setLoading(false);
      return;
    }

    const payload = (await response.json()) as AdminInquiry;
    applyInquiry(payload);
    setLoading(false);
  }, [applyInquiry, authFetch, inquiryId]);

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void loadInquiry();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadInquiry, status]);

  async function handleSave() {
    setSaving(true);

    const payload: InquiryMutationPayload = {
      status: statusValue,
      adminNotes: notesValue.trim(),
    };

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
      setSaving(false);
      return;
    }

    const updatedInquiry = (await response.json()) as AdminInquiry;
    applyInquiry(updatedInquiry);
    dispatchAdminInquiriesUpdated();
    toast.success("Inquiry updated");
    setSaving(false);
  }

  async function handleToggleRead() {
    if (!inquiry) {
      return;
    }

    setReadToggling(true);

    const response = await authFetch(`/admin/inquiries/${inquiryId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isRead: !inquiry.isRead,
      } satisfies InquiryMutationPayload),
    });

    if (!response.ok) {
      const errorBody = await readBackendError(response);
      toast.error(
        getBackendErrorMessage(errorBody, "Unable to update this inquiry"),
      );
      setReadToggling(false);
      return;
    }

    const updatedInquiry = (await response.json()) as AdminInquiry;
    applyInquiry(updatedInquiry);
    dispatchAdminInquiriesUpdated();
    toast.success(
      updatedInquiry.isRead
        ? "Inquiry marked as read"
        : "Inquiry marked as unread",
    );
    setReadToggling(false);
  }

  async function handleDelete() {
    if (!inquiry) {
      return;
    }

    if (!window.confirm(`Delete inquiry from ${inquiry.name}? This cannot be undone.`)) {
      return;
    }

    setDeleting(true);

    const response = await authFetch(`/admin/inquiries/${inquiryId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorBody = await readBackendError(response);
      toast.error(
        getBackendErrorMessage(errorBody, "Unable to delete this inquiry"),
      );
      setDeleting(false);
      return;
    }

    toast.success("Inquiry deleted");
    dispatchAdminInquiriesUpdated();
    router.replace(localizeHref(lang, "/admin/inquiries"));
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <Skeleton className="h-[34rem]" />
          <Skeleton className="h-[22rem]" />
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <StateCard
        eyebrow="Inquiries"
        title="Inquiry not found"
        description="The backend did not return an inquiry for this identifier."
        action={
          <Button asChild size="lg">
            <Link href={localizeHref(lang, "/admin/inquiries")}>
              Back to inquiries
            </Link>
          </Button>
        }
      />
    );
  }

  if (error || !inquiry) {
    return (
      <StateCard
        eyebrow="Inquiries"
        title="Unable to load inquiry"
        description={error ?? "The backend did not return usable inquiry data."}
        tone="warning"
        action={
          <Button type="button" size="lg" onClick={() => void loadInquiry()}>
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
            Inquiry detail
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
            {inquiry.name}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
            Review the submission, keep internal notes, and move the inquiry through its admin workflow.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href={localizeHref(lang, "/admin/inquiries")}>
              <ArrowLeft className="size-4" />
              Back to inquiries
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={readToggling}
            onClick={() => void handleToggleRead()}
          >
            {inquiry.isRead ? "Mark unread" : "Mark read"}
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={deleting || readToggling}
            onClick={() => void handleDelete()}
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <Card variant="solid">
          <CardHeader>
            <CardTitle>Message</CardTitle>
            <CardDescription>
              Contact submissions are stored exactly as entered by the public form.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-3 rounded-xl border border-border bg-background/70 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-lg font-semibold text-foreground">
                    {inquiry.name}
                  </p>
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
              <p className="whitespace-pre-wrap text-sm leading-7 text-foreground/90">
                {inquiry.message}
              </p>
              <Button asChild variant="outline" size="sm" className="justify-between sm:w-fit">
                <Link href={`mailto:${inquiry.email}`}>
                  Reply by email
                  <Mail className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Internal notes
              </p>
              <Textarea
                value={notesValue}
                onChange={(event) => setNotesValue(event.target.value)}
                placeholder="Capture follow-up details, decisions, or next steps."
                className="min-h-40"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
              <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                Status and notes are saved through the optional admin inquiry update endpoint.
              </p>
              <Button
                type="button"
                size="lg"
                disabled={saving || deleting}
                onClick={() => void handleSave()}
              >
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card variant="solid">
            <CardHeader>
              <CardTitle>Status</CardTitle>
              <CardDescription>
                Choose the workflow state that best reflects the current follow-up stage.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {statusOptions.map((option) => {
                const isActive = statusValue === option;

                return (
                  <button
                    key={option}
                    type="button"
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/45 ${
                      isActive
                        ? "border-primary/20 bg-primary/10 text-foreground"
                        : "border-border bg-background/70 text-foreground hover:bg-secondary"
                    }`}
                    onClick={() => setStatusValue(option)}
                  >
                    <span>{formatInquiryStatus(option)}</span>
                    <Badge variant={getInquiryBadgeVariant(option)}>
                      {isActive ? "Selected" : "Set"}
                    </Badge>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <Card variant="solid">
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
              <CardDescription>
                Timing and persistence details from the backend record.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Fact label="Received" value={formatDate(inquiry.createdAt)} />
              <Fact label="Updated" value={formatDate(inquiry.updatedAt)} />
              <Fact label="Read state" value={inquiry.isRead ? "Read" : "Unread"} />
              <Fact label="Record id" value={inquiry.id} mono />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Fact({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border pb-4 last:border-b-0 last:pb-0">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p
        className={`text-right text-sm font-semibold text-foreground ${
          mono ? "break-all font-mono text-xs" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function getInquiryBadgeVariant(status: InquiryStatus) {
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

function formatInquiryStatus(status: InquiryStatus) {
  return status
    .toLowerCase()
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}
