'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, RefreshCcw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { StateCard } from '@/features/portfolio/components/state-card';
import { localeTags, localizeHref, type AppLocale } from '@/features/portfolio/i18n/routing';
import type { PortfolioDictionary } from '@/features/portfolio/i18n/types';
import { getBackendErrorMessage, readBackendError } from '../lib/backend-errors';
import { resolveProjectImageUrl } from '../lib/project-form';
import { resolveProjectTranslation } from '@/features/portfolio/lib/project-translations';
import type { AdminProject, ProjectMutationPayload } from '../model/types';
import { useAdminAuth } from '../auth/use-admin-auth';

interface AdminProjectsScreenProps {
  lang: AppLocale;
  dictionary: PortfolioDictionary;
}

export function AdminProjectsScreen({ lang, dictionary }: AdminProjectsScreenProps) {
  const { authFetch, status } = useAdminAuth();
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDrafts, setOrderDrafts] = useState<Record<string, string>>({});
  const [pendingProjectId, setPendingProjectId] = useState<string | null>(null);

  const formatDate = useMemo(
    () => (value: string) =>
      new Intl.DateTimeFormat(localeTags[lang], {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(value)),
    [lang]
  );

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await authFetch('/admin/projects');

    if (!response.ok) {
      if (response.status !== 401 && response.status !== 403) {
        const errorBody = await readBackendError(response);
        setError(
          getBackendErrorMessage(errorBody, dictionary.admin.projectsPage.loadErrorFallback)
        );
      }

      setLoading(false);
      return;
    }

    const payload = (await response.json()) as AdminProject[];
    setProjects(payload);
    setOrderDrafts(
      Object.fromEntries(payload.map((project) => [project.id, project.displayOrder.toString()]))
    );
    setLoading(false);
  }, [authFetch, dictionary.admin.projectsPage.loadErrorFallback]);

  useEffect(() => {
    if (status !== 'authenticated') {
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
    successMessage: string
  ) {
    setPendingProjectId(projectId);

    const response = await authFetch(`/admin/projects/${projectId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await readBackendError(response);
      toast.error(
        getBackendErrorMessage(errorBody, dictionary.admin.projectsPage.updateErrorFallback)
      );
      setPendingProjectId(null);
      return;
    }

    toast.success(successMessage);
    await loadProjects();
    setPendingProjectId(null);
  }

  async function handleDelete(project: AdminProject) {
    const localizedProject = resolveProjectTranslation(project.translations, lang);

    if (
      !window.confirm(
        dictionary.admin.projectsPage.deleteConfirm.replace(
          '{title}',
          localizedProject?.title ?? project.slug
        )
      )
    ) {
      return;
    }

    setPendingProjectId(project.id);

    const response = await authFetch(`/admin/projects/${project.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorBody = await readBackendError(response);
      toast.error(
        getBackendErrorMessage(errorBody, dictionary.admin.projectsPage.deleteErrorFallback)
      );
      setPendingProjectId(null);
      return;
    }

    toast.success(dictionary.admin.projectsPage.deleteSuccess);
    setProjects((currentProjects) => currentProjects.filter((entry) => entry.id !== project.id));
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
        eyebrow={dictionary.admin.projectsPage.eyebrow}
        title={dictionary.admin.projectsPage.loadErrorTitle}
        description={error}
        tone="warning"
        action={
          <Button type="button" size="lg" onClick={() => void loadProjects()}>
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
            {dictionary.admin.projectsPage.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
            {dictionary.admin.projectsPage.title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
            {dictionary.admin.projectsPage.description}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href={localizeHref(lang, '/admin')}>
              {dictionary.admin.projectsPage.backToDashboard}
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href={localizeHref(lang, '/admin/projects/new')}>
              {dictionary.admin.projectsPage.newProject}
            </Link>
          </Button>
        </div>
      </section>

      {projects.length === 0 ? (
        <StateCard
          eyebrow={dictionary.admin.projectsPage.eyebrow}
          title={dictionary.admin.projectsPage.emptyTitle}
          description={dictionary.admin.projectsPage.emptyDescription}
          action={
            <Button asChild size="lg">
              <Link href={localizeHref(lang, '/admin/projects/new')}>
                {dictionary.admin.projectsPage.createProject}
              </Link>
            </Button>
          }
        />
      ) : (
        <section className="grid gap-4">
          {projects.map((project) => {
            const imageUrl = resolveProjectImageUrl(project.imageUrl);
            const isPending = pendingProjectId === project.id;
            const localizedProject = resolveProjectTranslation(project.translations, lang);
            const projectTitle = localizedProject?.title ?? project.slug;
            const projectSummary = localizedProject?.summary ?? '';

            return (
              <Card key={project.id} variant="solid">
                <CardContent className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[7rem_minmax(0,1fr)_18rem]">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-secondary">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={projectTitle}
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
                          href={localizeHref(lang, `/admin/projects/${project.id}`)}
                          className="inline-flex items-center gap-2 text-lg font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/45"
                        >
                          <span className="truncate">{projectTitle}</span>
                          <ArrowUpRight className="size-4 shrink-0" />
                        </Link>
                        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                          {project.slug}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={project.published ? 'success' : 'warning'}>
                          {project.published ? dictionary.admin.published : dictionary.admin.draft}
                        </Badge>
                        {project.featured ? (
                          <Badge variant="accent">{dictionary.admin.featured}</Badge>
                        ) : null}
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-muted-foreground">{projectSummary}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.technologies.length > 0 ? (
                        project.technologies.slice(0, 6).map((technology) => (
                          <Badge key={technology} variant="outline">
                            {technology}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline">
                          {dictionary.admin.projectsPage.noTechnologies}
                        </Badge>
                      )}
                    </div>

                    <p className="mt-4 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      {dictionary.admin.projectsPage.updatedLabel} {formatDate(project.updatedAt)}
                    </p>
                  </div>

                  <div className="grid gap-4 rounded-xl border border-border bg-background/70 p-4">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                      <Button
                        type="button"
                        variant={project.published ? 'secondary' : 'primary'}
                        size="sm"
                        disabled={isPending}
                        onClick={() =>
                          void patchProject(
                            project.id,
                            { published: !project.published },
                            project.published
                              ? dictionary.admin.projectsPage.movedToDraft
                              : dictionary.admin.projectsPage.publishedSuccess
                          )
                        }
                      >
                        {project.published
                          ? dictionary.admin.projectsPage.moveToDraftAction
                          : dictionary.admin.projectsPage.publishAction}
                      </Button>

                      <Button
                        type="button"
                        variant={project.featured ? 'secondary' : 'outline'}
                        size="sm"
                        disabled={isPending}
                        onClick={() =>
                          void patchProject(
                            project.id,
                            { featured: !project.featured },
                            project.featured
                              ? dictionary.admin.projectsPage.featuredRemoved
                              : dictionary.admin.projectsPage.featuredSuccess
                          )
                        }
                      >
                        {project.featured
                          ? dictionary.admin.projectsPage.unfeatureAction
                          : dictionary.admin.projectsPage.featureAction}
                      </Button>
                    </div>

                    <div className="grid gap-2">
                      <LabelRow>{dictionary.admin.projectsPage.displayOrderLabel}</LabelRow>
                      <div className="flex items-center gap-2">
                        <Input
                          value={orderDrafts[project.id] ?? ''}
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
                            const rawValue = orderDrafts[project.id] ?? '';
                            const parsedValue = Number(rawValue);

                            if (
                              rawValue.trim().length === 0 ||
                              !Number.isInteger(parsedValue) ||
                              parsedValue < 0
                            ) {
                              toast.error(dictionary.admin.projectsPage.displayOrderInvalid);
                              return;
                            }

                            void patchProject(
                              project.id,
                              { displayOrder: parsedValue },
                              dictionary.admin.projectsPage.displayOrderSaved
                            );
                          }}
                        >
                          {dictionary.admin.projectsPage.saveAction}
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                      <Button asChild variant="outline" size="sm">
                        <Link href={localizeHref(lang, `/admin/projects/${project.id}`)}>
                          {dictionary.admin.projectsPage.editProjectAction}
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
                        {dictionary.admin.projectsPage.deleteAction}
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
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{children}</p>
  );
}
