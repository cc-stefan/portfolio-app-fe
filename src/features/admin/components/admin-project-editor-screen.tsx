"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  ImagePlus,
  RefreshCcw,
  Trash2,
  X,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { StateCard } from "@/features/portfolio/components/state-card";
import { localizeHref, type AppLocale } from "@/features/portfolio/i18n/routing";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "../auth/use-admin-auth";
import {
  getBackendFieldErrors,
  getBackendErrorMessage,
  getProjectSlugConflictMessage,
  readBackendError,
} from "../lib/backend-errors";
import {
  buildCreateProjectPayload,
  buildUpdateProjectPayload,
  createEmptyProjectFormValues,
  createProjectFormValues,
  getProjectFileValidationError,
  isUploadedProjectImage,
  resolveProjectCoverImageUrl,
  validateProjectForm,
} from "../lib/project-form";
import type {
  AdminProject,
  ProjectFieldErrors,
  ProjectFieldName,
  ProjectFormValues,
} from "../model/types";

interface AdminProjectEditorScreenProps {
  lang: AppLocale;
  projectId?: string;
}

const projectErrorFieldByFormField: Partial<
  Record<keyof ProjectFormValues, ProjectFieldName>
> = {
  title: "title",
  slug: "slug",
  summary: "summary",
  description: "description",
  coverImageUrl: "coverImageUrl",
  liveUrl: "liveUrl",
  repositoryUrl: "repositoryUrl",
  technologies: "technologies",
  displayOrder: "displayOrder",
};

export function AdminProjectEditorScreen({
  lang,
  projectId,
}: AdminProjectEditorScreenProps) {
  const router = useRouter();
  const { authFetch, status } = useAdminAuth();
  const [project, setProject] = useState<AdminProject | null>(null);
  const [formValues, setFormValues] = useState<ProjectFormValues>(
    createEmptyProjectFormValues(),
  );
  const [technologyInput, setTechnologyInput] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ProjectFieldErrors>({});
  const [pageError, setPageError] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(projectId));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notFound, setNotFound] = useState(false);

  const isEditing = Boolean(projectId);
  const currentCoverImageUrl = formValues.coverImageUrl;
  const resolvedCoverImageUrl = useMemo(
    () => resolveProjectCoverImageUrl(currentCoverImageUrl),
    [currentCoverImageUrl],
  );
  const usesUploadedImage = isUploadedProjectImage(project?.coverImageUrl ?? null);

  const applyProject = useCallback((nextProject: AdminProject) => {
    setProject(nextProject);
    setFormValues(createProjectFormValues(nextProject));
  }, []);

  const loadProject = useCallback(async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setPageError(null);
    setNotFound(false);

    const response = await authFetch(`/admin/projects/${projectId}`);

    if (response.status === 404) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    if (!response.ok) {
      if (response.status !== 401 && response.status !== 403) {
        const errorBody = await readBackendError(response);
        setPageError(
          getBackendErrorMessage(errorBody, "Unable to load this project"),
        );
      }

      setLoading(false);
      return;
    }

    const payload = (await response.json()) as AdminProject;
    applyProject(payload);
    setLoading(false);
  }, [applyProject, authFetch, projectId]);

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void loadProject();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadProject, status]);

  function updateField<K extends keyof ProjectFormValues>(
    field: K,
    value: ProjectFormValues[K],
  ) {
    const errorField = projectErrorFieldByFormField[field];

    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));

    if (errorField) {
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        [errorField]: undefined,
      }));
    }
  }

  function addTechnology() {
    const nextTechnology = technologyInput.trim();

    if (!nextTechnology) {
      return;
    }

    updateField("technologies", [...formValues.technologies, nextTechnology]);
    setTechnologyInput("");
  }

  function removeTechnology(technology: string) {
    updateField(
      "technologies",
      formValues.technologies.filter((entry) => entry !== technology),
    );
  }

  function handleTechnologyKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTechnology();
    }
  }

  async function uploadCoverImage(nextProjectId: string) {
    if (!selectedFile) {
      return true;
    }

    const validationError = getProjectFileValidationError(selectedFile);

    if (validationError) {
      setFileError(validationError);
      toast.error(validationError);
      return false;
    }

    setUploading(true);
    setFileError(null);

    const payload = new FormData();
    payload.set("file", selectedFile);

    const response = await authFetch(`/admin/projects/${nextProjectId}/cover-image`, {
      method: "POST",
      body: payload,
    });

    if (!response.ok) {
      const errorBody = await readBackendError(response);
      const message = getBackendErrorMessage(
        errorBody,
        "Unable to upload cover image",
      );
      setFileError(message);
      toast.error(message);
      setUploading(false);
      return false;
    }

    setSelectedFile(null);
    setUploading(false);
    return true;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateProjectForm(formValues);

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setSaving(true);
    setFieldErrors({});
    setPageError(null);

    const response = await authFetch(
      isEditing ? `/admin/projects/${projectId}` : "/admin/projects",
      {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          isEditing
            ? buildUpdateProjectPayload(formValues)
            : buildCreateProjectPayload(formValues),
        ),
      },
    );

    if (!response.ok) {
      const errorBody = await readBackendError(response);
      const nextFieldErrors = getBackendFieldErrors(errorBody);
      const slugConflictMessage = getProjectSlugConflictMessage(errorBody);

      if (slugConflictMessage) {
        nextFieldErrors.slug = slugConflictMessage;
      }

      if (Object.keys(nextFieldErrors).length > 0) {
        setFieldErrors(nextFieldErrors);
      }

      setPageError(
        slugConflictMessage ??
          getBackendErrorMessage(errorBody, "Unable to save this project"),
      );
      setSaving(false);
      return;
    }

    const savedProject = (await response.json()) as AdminProject;
    const uploadSucceeded = await uploadCoverImage(savedProject.id);

    if (!uploadSucceeded) {
      if (!isEditing) {
        router.replace(localizeHref(lang, `/admin/projects/${savedProject.id}`));
      } else {
        await loadProject();
      }

      setSaving(false);
      return;
    }

    toast.success(isEditing ? "Project updated" : "Project created");

    if (isEditing) {
      await loadProject();
    } else {
      router.replace(localizeHref(lang, `/admin/projects/${savedProject.id}`));
    }

    setSaving(false);
  }

  async function handleRemoveUploadedImage() {
    if (!projectId || !usesUploadedImage) {
      return;
    }

    setUploading(true);

    const response = await authFetch(`/admin/projects/${projectId}/cover-image`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorBody = await readBackendError(response);
      toast.error(
        getBackendErrorMessage(errorBody, "Unable to remove cover image"),
      );
      setUploading(false);
      return;
    }

    toast.success("Cover image removed");
    await loadProject();
    setUploading(false);
  }

  async function handleDeleteProject() {
    if (!projectId || !project) {
      return;
    }

    if (!window.confirm(`Delete “${project.title}”? This cannot be undone.`)) {
      return;
    }

    setDeleting(true);

    const response = await authFetch(`/admin/projects/${projectId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorBody = await readBackendError(response);
      toast.error(
        getBackendErrorMessage(errorBody, "Unable to delete this project"),
      );
      setDeleting(false);
      return;
    }

    toast.success("Project deleted");
    router.replace(localizeHref(lang, "/admin/projects"));
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-5 w-80" />
        </div>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <Skeleton className="h-[44rem]" />
          <Skeleton className="h-[28rem]" />
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <StateCard
        eyebrow="Projects"
        title="Project not found"
        description="The backend did not return a project for this identifier."
        action={
          <Button asChild size="lg">
            <Link href={localizeHref(lang, "/admin/projects")}>
              Back to projects
            </Link>
          </Button>
        }
      />
    );
  }

  if (pageError && isEditing && !project) {
    return (
      <StateCard
        eyebrow="Projects"
        title="Unable to load project"
        description={pageError}
        tone="warning"
        action={
          <Button type="button" size="lg" onClick={() => void loadProject()}>
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
            {isEditing ? "Edit project" : "Create project"}
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
            {isEditing ? project?.title ?? "Project editor" : "New project"}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
            Manage the exact project fields accepted by the backend DTO, then optionally upload a cover image through the dedicated multipart endpoint.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href={localizeHref(lang, "/admin/projects")}>
              <ArrowLeft className="size-4" />
              Back to projects
            </Link>
          </Button>
          {isEditing ? (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={deleting}
              onClick={() => void handleDeleteProject()}
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
          ) : null}
        </div>
      </section>

      {pageError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {pageError}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <Card variant="solid">
          <CardContent className="p-5 sm:p-6 lg:p-8">
            <form className="grid gap-8" onSubmit={handleSubmit} noValidate>
              <section className="grid gap-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    Core fields
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    `title` and `summary` are required. `slug` is optional and must stay lowercase kebab-case.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Title"
                    error={fieldErrors.title}
                    description="Required, 1 to 120 characters."
                  >
                    <Input
                      value={formValues.title}
                      onChange={(event) => updateField("title", event.target.value)}
                      placeholder="Project title"
                      aria-invalid={Boolean(fieldErrors.title)}
                    />
                  </Field>
                  <Field
                    label="Slug"
                    error={fieldErrors.slug}
                    description="Optional, lowercase kebab-case, 1 to 160 characters."
                  >
                    <Input
                      value={formValues.slug}
                      onChange={(event) => updateField("slug", event.target.value)}
                      placeholder="auto-generated-from-title"
                      aria-invalid={Boolean(fieldErrors.slug)}
                    />
                  </Field>
                </div>
                <Field
                  label="Summary"
                  error={fieldErrors.summary}
                  description="Required, 1 to 300 characters."
                >
                  <Textarea
                    value={formValues.summary}
                    onChange={(event) => updateField("summary", event.target.value)}
                    placeholder="Short portfolio summary"
                    className="min-h-28"
                    aria-invalid={Boolean(fieldErrors.summary)}
                  />
                </Field>
                <Field
                  label="Description"
                  error={fieldErrors.description}
                  description="Optional, up to 5000 characters."
                >
                  <Textarea
                    value={formValues.description}
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                    placeholder="Long-form project content"
                    className="min-h-44"
                    aria-invalid={Boolean(fieldErrors.description)}
                  />
                </Field>
              </section>

              <section className="grid gap-5 border-t border-border pt-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    Links and image source
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Use the direct URL fields for externally hosted assets and links. Uploaded cover images are managed separately.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Cover image URL"
                    error={fieldErrors.coverImageUrl}
                    description="Optional, up to 500 characters."
                  >
                    <Input
                      value={formValues.coverImageUrl}
                      onChange={(event) =>
                        updateField("coverImageUrl", event.target.value)
                      }
                      placeholder="https://..."
                      aria-invalid={Boolean(fieldErrors.coverImageUrl)}
                    />
                  </Field>
                  <Field
                    label="Live URL"
                    error={fieldErrors.liveUrl}
                    description="Optional, up to 500 characters."
                  >
                    <Input
                      value={formValues.liveUrl}
                      onChange={(event) => updateField("liveUrl", event.target.value)}
                      placeholder="https://..."
                      aria-invalid={Boolean(fieldErrors.liveUrl)}
                    />
                  </Field>
                </div>
                <Field
                  label="Repository URL"
                  error={fieldErrors.repositoryUrl}
                  description="Optional, up to 500 characters."
                >
                  <Input
                    value={formValues.repositoryUrl}
                    onChange={(event) =>
                      updateField("repositoryUrl", event.target.value)
                    }
                    placeholder="https://github.com/..."
                    aria-invalid={Boolean(fieldErrors.repositoryUrl)}
                  />
                </Field>
              </section>

              <section className="grid gap-5 border-t border-border pt-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    Technologies
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Up to 20 entries. Each value is trimmed and deduplicated before submit.
                  </p>
                </div>
                <Field
                  label="Technology list"
                  error={fieldErrors.technologies}
                  description="Optional array with up to 20 items."
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                      <Input
                        value={technologyInput}
                        onChange={(event) => setTechnologyInput(event.target.value)}
                        onKeyDown={handleTechnologyKeyDown}
                        placeholder="Add technology"
                      />
                      <Button type="button" variant="outline" onClick={addTechnology}>
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formValues.technologies.length > 0 ? (
                        formValues.technologies.map((technology) => (
                          <button
                            key={technology}
                            type="button"
                            className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
                            onClick={() => removeTechnology(technology)}
                          >
                            {technology}
                            <X className="size-3.5" />
                          </button>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No technologies added yet.
                        </p>
                      )}
                    </div>
                  </div>
                </Field>
              </section>

              <section className="grid gap-5 border-t border-border pt-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    Publishing
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Publish and feature flags are sent directly to the backend, together with the integer display order.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <ToggleField
                    label="Published"
                    description="Controls visibility on the public `/projects` feed."
                    checked={formValues.published}
                    onCheckedChange={(checked) => updateField("published", checked)}
                  />
                  <ToggleField
                    label="Featured"
                    description="Featured projects are visually prioritized on the public site."
                    checked={formValues.featured}
                    onCheckedChange={(checked) => updateField("featured", checked)}
                  />
                </div>
                <Field
                  label="Display order"
                  error={fieldErrors.displayOrder}
                  description="Optional integer greater than or equal to 0."
                >
                  <Input
                    value={formValues.displayOrder}
                    onChange={(event) =>
                      updateField("displayOrder", event.target.value)
                    }
                    inputMode="numeric"
                    placeholder="0"
                    aria-invalid={Boolean(fieldErrors.displayOrder)}
                  />
                </Field>
              </section>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-8">
                <p className="text-sm leading-6 text-muted-foreground">
                  The payload includes only backend-supported project fields. Unknown keys are never sent.
                </p>
                <Button type="submit" size="lg" disabled={saving || uploading}>
                  {saving
                    ? isEditing
                      ? "Saving project..."
                      : "Creating project..."
                    : isEditing
                      ? "Save changes"
                      : "Create project"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card variant="solid" className="overflow-hidden">
            <CardHeader>
              <CardTitle>Cover image</CardTitle>
              <CardDescription>
                External image URLs are saved via PATCH. File uploads use the dedicated multipart endpoint.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-secondary">
                {resolvedCoverImageUrl ? (
                  <Image
                    src={resolvedCoverImageUrl}
                    alt={formValues.title || "Project cover image"}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
                    No cover image configured yet.
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {formValues.published ? (
                  <Badge variant="success">Published</Badge>
                ) : (
                  <Badge variant="warning">Draft</Badge>
                )}
                {formValues.featured ? (
                  <Badge variant="accent">Featured</Badge>
                ) : null}
                {usesUploadedImage ? (
                  <Badge variant="outline">Uploaded image</Badge>
                ) : resolvedCoverImageUrl ? (
                  <Badge variant="outline">External image</Badge>
                ) : null}
              </div>

              <Field
                label="Upload file"
                error={fileError ?? undefined}
                description="JPEG, PNG, WEBP, GIF, or AVIF up to 5 MB."
              >
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-secondary px-4 py-4 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                  <ImagePlus className="size-4" />
                  {selectedFile ? selectedFile.name : "Choose image"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      setSelectedFile(file);
                      setFileError(getProjectFileValidationError(file));
                    }}
                  />
                </label>
              </Field>

              {usesUploadedImage && projectId ? (
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  onClick={() => void handleRemoveUploadedImage()}
                >
                  Remove uploaded image
                </Button>
              ) : null}

              {!isEditing ? (
                <p className="text-sm leading-6 text-muted-foreground">
                  If you select a file now, it will upload automatically right after the project is created.
                </p>
              ) : null}

              {formValues.liveUrl ? (
                <Button asChild variant="ghost" size="sm">
                  <Link href={formValues.liveUrl} target="_blank" rel="noreferrer">
                    Open live URL
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  description,
  error,
  children,
}: {
  label: string;
  description: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      {children}
      <p
        className={cn(
          "text-xs leading-5 text-muted-foreground",
          error && "text-destructive",
        )}
      >
        {error ?? description}
      </p>
    </div>
  );
}

function ToggleField({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 rounded-xl border border-border bg-background/70 p-4">
      <input
        type="checkbox"
        className="mt-1 size-4 rounded border-border text-primary"
        checked={checked}
        onChange={(event) => onCheckedChange(event.target.checked)}
      />
      <span>
        <span className="block text-sm font-medium text-foreground">{label}</span>
        <span className="mt-1 block text-sm leading-6 text-muted-foreground">
          {description}
        </span>
      </span>
    </label>
  );
}
