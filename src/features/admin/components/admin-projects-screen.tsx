"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpRight, RefreshCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { resolveProjectImageUrl } from "../lib/project-form";
import type { AdminProject, ProjectMutationPayload } from "../model/types";
import { useAdminAuth } from "../auth/use-admin-auth";

interface AdminProjectsScreenProps {
  lang: AppLocale;
}

export function AdminProjectsScreen({ lang }: AdminProjectsScreenProps) {
  const { authFetch, status } = useAdminAuth();
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDrafts, setOrderDrafts] = useState<Record<string, string>>({});
  const [pendingProjectId, setPendingProjectId] = useState<string | null>(null);

  const formatDate = useMemo(
    () => (value: string) =>
      new Intl.DateTimeFormat(localeTags[lang], {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(value)),
    [lang],
  );

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await authFetch("/admin/projects");

    if (!response.ok) {
      if (response.status !== 401 && response.status !== 403) {
        const errorBody = await readBackendError(response);
        setError(
          getBackendErrorMessage(errorBody, "Unable to load admin projects"),
        );
      }

      setLoading(false);
      return;
    }

    const payload = (await response.json()) as AdminProject[];
    setProjects(payload);
    setOrderDrafts(
      Object.fromEntries(
        payload.map((project) => [project.id, project.displayOrder.toString()]),
      ),
    );
    setLoading(false);
  }, [authFetch]);

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void loadProjects();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadProjects, status]);

  async function patchProject(
    projectId: string,
    payload: Partial<ProjectMutationPayload>,
    successMessage: string,
  ) {
    setPendingProjectId(projectId);

    const response = await authFetch(`/admin/projects/${projectId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await readBackendError(response);
      toast.error(
        getBackendErrorMessage(errorBody, "Unable to update this project"),
      );
      setPendingProjectId(null);
      return;
    }

    toast.success(successMessage);
    await loadProjects();
    setPendingProjectId(null);
  }

  async function handleDelete(project: AdminProject) {
    if (!window.confirm(`Delete “${project.title}”? This cannot be undone.`)) {
      return;
    }

    setPendingProjectId(project.id);

    const response = await authFetch(`/admin/projects/${project.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorBody = await readBackendError(response);
      toast.error(
        getBackendErrorMessage(errorBody, "Unable to delete this project"),
      );
      setPendingProjectId(null);
      return;
    }

    toast.success("Project deleted");
    setProjects((currentProjects) =>
      currentProjects.filter((entry) => entry.id !== project.id),
    );
    setPendingProjectId(null);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-10 w-52" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-44" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <StateCard
        eyebrow="Projects"
        title="Unable to load projects"
        description={error}
        tone="warning"
        action={
          <Button type="button" size="lg" onClick={() => void loadProjects()}>
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
            Admin projects
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
            Manage portfolio entries
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
            Create, edit, publish, feature, sort, upload images, or remove
            projects using the exact admin endpoints exposed by the backend.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href={localizeHref(lang, "/admin")}>Back to dashboard</Link>
          </Button>
          <Button asChild size="sm">
            <Link href={localizeHref(lang, "/admin/projects/new")}>
              New project
            </Link>
          </Button>
        </div>
      </section>

      {projects.length === 0 ? (
        <StateCard
          eyebrow="Projects"
          title="No projects found"
          description="Create the first project to populate the published portfolio feed."
          action={
            <Button asChild size="lg">
              <Link href={localizeHref(lang, "/admin/projects/new")}>
                Create project
              </Link>
            </Button>
          }
        />
      ) : (
        <section className="grid gap-4">
          {projects.map((project) => {
            const imageUrl = resolveProjectImageUrl(project.imageUrl);
            const isPending = pendingProjectId === project.id;

            return (
              <Card key={project.id} variant="solid">
                <CardContent className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[7rem_minmax(0,1fr)_18rem]">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-secondary">
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
                        <Link
                          href={localizeHref(
                            lang,
                            `/admin/projects/${project.id}`,
                          )}
                          className="inline-flex items-center gap-2 text-lg font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/45"
                        >
                          <span className="truncate">{project.title}</span>
                          <ArrowUpRight className="size-4 shrink-0" />
                        </Link>
                        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                          {project.slug}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant={project.published ? "success" : "warning"}
                        >
                          {project.published ? "Published" : "Draft"}
                        </Badge>
                        {project.featured ? (
                          <Badge variant="accent">Featured</Badge>
                        ) : null}
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-muted-foreground">
                      {project.summary}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.technologies.length > 0 ? (
                        project.technologies.slice(0, 6).map((technology) => (
                          <Badge key={technology} variant="outline">
                            {technology}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline">No technologies</Badge>
                      )}
                    </div>

                    <p className="mt-4 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      Updated {formatDate(project.updatedAt)}
                    </p>
                  </div>

                  <div className="grid gap-4 rounded-xl border border-border bg-background/70 p-4">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                      <Button
                        type="button"
                        variant={project.published ? "secondary" : "primary"}
                        size="sm"
                        disabled={isPending}
                        onClick={() =>
                          void patchProject(
                            project.id,
                            { published: !project.published },
                            project.published
                              ? "Project moved to draft"
                              : "Project published",
                          )
                        }
                      >
                        {project.published ? "Move to draft" : "Publish"}
                      </Button>

                      <Button
                        type="button"
                        variant={project.featured ? "secondary" : "outline"}
                        size="sm"
                        disabled={isPending}
                        onClick={() =>
                          void patchProject(
                            project.id,
                            { featured: !project.featured },
                            project.featured
                              ? "Featured flag removed"
                              : "Project marked as featured",
                          )
                        }
                      >
                        {project.featured ? "Unfeature" : "Feature"}
                      </Button>
                    </div>

                    <div className="grid gap-2">
                      <LabelRow>Display order</LabelRow>
                      <div className="flex items-center gap-2">
                        <Input
                          value={orderDrafts[project.id] ?? ""}
                          inputMode="numeric"
                          onChange={(event) =>
                            setOrderDrafts((currentDrafts) => ({
                              ...currentDrafts,
                              [project.id]: event.target.value,
                            }))
                          }
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isPending}
                          onClick={() => {
                            const rawValue = orderDrafts[project.id] ?? "";
                            const parsedValue = Number(rawValue);

                            if (
                              rawValue.trim().length === 0 ||
                              !Number.isInteger(parsedValue) ||
                              parsedValue < 0
                            ) {
                              toast.error(
                                "Display order must be a whole number greater than or equal to 0",
                              );
                              return;
                            }

                            void patchProject(
                              project.id,
                              { displayOrder: parsedValue },
                              "Display order updated",
                            );
                          }}
                        >
                          Save
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                      <Button asChild variant="outline" size="sm">
                        <Link
                          href={localizeHref(
                            lang,
                            `/admin/projects/${project.id}`,
                          )}
                        >
                          Edit project
                        </Link>
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        disabled={isPending}
                        onClick={() => void handleDelete(project)}
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      )}
    </div>
  );
}

function LabelRow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
      {children}
    </p>
  );
}
