'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCcw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { StateCard } from '@/features/portfolio/components/state-card';
import { defaultLocale, localizeHref, type AppLocale } from '@/features/portfolio/i18n/routing';
import type { PortfolioDictionary } from '@/features/portfolio/i18n/types';
import { resolveProjectTranslation } from '@/features/portfolio/lib/project-translations';
import { useAdminAuth } from '../auth/use-admin-auth';
import {
  getBackendFieldErrors,
  getBackendErrorMessage,
  getProjectSlugConflictMessage,
  readBackendError,
} from '../lib/backend-errors';
import {
  buildCreateProjectPayload,
  buildUpdateProjectPayload,
  createEmptyProjectFormValues,
  createProjectFormValues,
  getFirstInvalidProjectLocale,
  getLocalizedProjectFieldPath,
  getProjectFileValidationError,
  isUploadedProjectImage,
  resolveProjectImageUrl,
  validateProjectForm,
} from '../lib/project-form';
import type {
  AdminProject,
  ProjectFieldErrors,
  ProjectFieldName,
  ProjectFormValues,
  ProjectLocalizedFieldName,
} from '../model/types';
import { AdminLoadingHeader, AdminLoadingPanel } from './admin-loading-primitives';
import { AdminProjectForm } from './admin-project-form';
import { AdminProjectImagePanel } from './admin-project-image-panel';

interface AdminProjectEditorScreenProps {
  lang: AppLocale;
  dictionary: PortfolioDictionary;
  projectId?: string;
}

const projectErrorFieldByFormField: Partial<
  Record<Exclude<keyof ProjectFormValues, 'translations'>, ProjectFieldName>
> = {
  slug: 'slug',
  liveUrl: 'liveUrl',
  repositoryUrl: 'repositoryUrl',
  projectDate: 'projectDate',
  technologies: 'technologies',
  displayOrder: 'displayOrder',
};

export function AdminProjectEditorScreen({
  lang,
  dictionary,
  projectId,
}: AdminProjectEditorScreenProps) {
  const router = useRouter();
  const { authFetch, status } = useAdminAuth();
  const copy = dictionary.admin.projectEditor;
  const [project, setProject] = useState<AdminProject | null>(null);
  const [formValues, setFormValues] = useState<ProjectFormValues>(createEmptyProjectFormValues());
  const [activeLocale, setActiveLocale] = useState<AppLocale>(lang);
  const [technologyInput, setTechnologyInput] = useState('');
  const [fieldErrors, setFieldErrors] = useState<ProjectFieldErrors>({});
  const [pageError, setPageError] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(projectId));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImagePreviewUrl, setSelectedImagePreviewUrl] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const isEditing = Boolean(projectId);
  const resolvedImageUrl = useMemo(
    () => resolveProjectImageUrl(project?.imageUrl ?? null),
    [project?.imageUrl]
  );
  const usesUploadedImage = isUploadedProjectImage(project?.imageUrl ?? null);

  useEffect(() => {
    return () => {
      if (selectedImagePreviewUrl) {
        URL.revokeObjectURL(selectedImagePreviewUrl);
      }
    };
  }, [selectedImagePreviewUrl]);

  const previewImageUrl = selectedImagePreviewUrl ?? resolvedImageUrl;
  const activeTranslation = formValues.translations[activeLocale];
  const localizedProject = project ? resolveProjectTranslation(project.translations, lang) : null;
  const previewImageAlt =
    activeTranslation.title.trim() ||
    formValues.translations[defaultLocale].title.trim() ||
    copy.imagePreviewAlt;

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
        setPageError(getBackendErrorMessage(errorBody, copy.loadErrorFallback));
      }

      setLoading(false);
      return;
    }

    const payload = (await response.json()) as AdminProject;
    applyProject(payload);
    setLoading(false);
  }, [applyProject, authFetch, copy.loadErrorFallback, projectId]);

  useEffect(() => {
    if (status !== 'authenticated') {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void loadProject();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadProject, status]);

  function updateField<K extends Exclude<keyof ProjectFormValues, 'translations'>>(
    field: K,
    value: ProjectFormValues[K]
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

  function updateLocalizedField(
    locale: AppLocale,
    field: ProjectLocalizedFieldName,
    value: string
  ) {
    const errorField = getLocalizedProjectFieldPath(locale, field);

    setFormValues((currentValues) => ({
      ...currentValues,
      translations: {
        ...currentValues.translations,
        [locale]: {
          ...currentValues.translations[locale],
          [field]: value,
        },
      },
    }));
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [errorField]: undefined,
    }));
  }

  function addTechnology() {
    const nextTechnology = technologyInput.trim();

    if (!nextTechnology) {
      return;
    }

    updateField('technologies', [...formValues.technologies, nextTechnology]);
    setTechnologyInput('');
  }

  function removeTechnology(technology: string) {
    updateField(
      'technologies',
      formValues.technologies.filter((entry) => entry !== technology)
    );
  }

  function replaceSelectedFile(file: File | null) {
    setSelectedFile(file);
    setSelectedImagePreviewUrl((currentPreviewUrl) => {
      if (currentPreviewUrl) {
        URL.revokeObjectURL(currentPreviewUrl);
      }

      return file ? URL.createObjectURL(file) : null;
    });
  }

  function handleSelectedFileChange(file: File | null) {
    replaceSelectedFile(file);
    setFileError(getProjectFileValidationError(file, copy));
  }

  async function handleUploadImage() {
    if (!projectId) {
      return;
    }

    if (!selectedFile) {
      const message = copy.chooseImageBeforeUpload;
      setFileError(message);
      toast.error(message);
      return;
    }

    const validationError = getProjectFileValidationError(selectedFile, copy);

    if (validationError) {
      setFileError(validationError);
      toast.error(validationError);
      return;
    }

    setUploading(true);
    setFileError(null);

    const payload = new FormData();
    payload.set('file', selectedFile);

    const response = await authFetch(`/admin/projects/${projectId}/image`, {
      method: 'POST',
      body: payload,
    });

    if (!response.ok) {
      const errorBody = await readBackendError(response);
      const message = getBackendErrorMessage(errorBody, copy.uploadImageError);
      setFileError(message);
      toast.error(message);
      setUploading(false);
      return;
    }

    const updatedProject = (await response.json()) as AdminProject;
    applyProject(updatedProject);
    replaceSelectedFile(null);
    toast.success(copy.uploadImageSuccess);
    setUploading(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateProjectForm(formValues, copy);

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      const firstInvalidLocale = getFirstInvalidProjectLocale(validationErrors);

      if (firstInvalidLocale) {
        setActiveLocale(firstInvalidLocale);
      }

      return;
    }

    setSaving(true);
    setFieldErrors({});
    setPageError(null);

    const response = await authFetch(
      isEditing ? `/admin/projects/${projectId}` : '/admin/projects',
      {
        method: isEditing ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          isEditing ? buildUpdateProjectPayload(formValues) : buildCreateProjectPayload(formValues)
        ),
      }
    );

    if (!response.ok) {
      const errorBody = await readBackendError(response);
      const nextFieldErrors = getBackendFieldErrors(errorBody);
      const slugConflictMessage = getProjectSlugConflictMessage(
        errorBody,
        copy.validation.slugInUse
      );

      if (slugConflictMessage) {
        nextFieldErrors.slug = slugConflictMessage;
      }

      if (Object.keys(nextFieldErrors).length > 0) {
        setFieldErrors(nextFieldErrors as ProjectFieldErrors);
        const firstInvalidLocale = getFirstInvalidProjectLocale(
          nextFieldErrors as ProjectFieldErrors
        );

        if (firstInvalidLocale) {
          setActiveLocale(firstInvalidLocale);
        }
      }

      setPageError(slugConflictMessage ?? getBackendErrorMessage(errorBody, copy.saveProjectError));
      setSaving(false);
      return;
    }

    const savedProject = (await response.json()) as AdminProject;
    toast.success(isEditing ? copy.projectUpdatedSuccess : copy.projectCreatedSuccess);

    if (isEditing) {
      applyProject(savedProject);
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

    const response = await authFetch(`/admin/projects/${projectId}/image`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorBody = await readBackendError(response);
      toast.error(getBackendErrorMessage(errorBody, copy.removeImageError));
      setUploading(false);
      return;
    }

    const updatedProject = (await response.json()) as AdminProject;
    applyProject(updatedProject);
    replaceSelectedFile(null);
    setFileError(null);
    toast.success(copy.removeImageSuccess);
    setUploading(false);
  }

  async function handleDeleteProject() {
    if (!projectId || !project) {
      return;
    }

    if (
      !window.confirm(
        copy.deleteConfirm.replace('{title}', localizedProject?.title ?? project.slug)
      )
    ) {
      return;
    }

    setDeleting(true);

    const response = await authFetch(`/admin/projects/${projectId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorBody = await readBackendError(response);
      toast.error(getBackendErrorMessage(errorBody, copy.deleteProjectError));
      setDeleting(false);
      return;
    }

    toast.success(copy.deleteProjectSuccess);
    router.replace(localizeHref(lang, '/admin/projects'));
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <AdminLoadingHeader className="page-enter" titleWidth="w-56" descriptionWidth="w-80" />
        <div className="page-enter grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <AdminLoadingPanel>
            <div className="space-y-5">
              <Skeleton className="h-10 w-44" />
              <div className="space-y-4 rounded-2xl border border-border bg-background/45 p-4">
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-32 w-full rounded-2xl" />
                <Skeleton className="h-11 w-full" />
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <Skeleton className="h-28 w-full rounded-2xl" />
                <Skeleton className="h-28 w-full rounded-2xl" />
              </div>
              <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
          </AdminLoadingPanel>
          <AdminLoadingPanel>
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-7 w-20 rounded-full" />
                <Skeleton className="h-7 w-20 rounded-full" />
                <Skeleton className="h-7 w-24 rounded-full" />
              </div>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </AdminLoadingPanel>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="page-enter">
        <StateCard
          eyebrow={dictionary.admin.navProjects}
          title={copy.notFoundTitle}
          description={copy.notFoundDescription}
          action={
            <Button asChild size="lg">
              <Link href={localizeHref(lang, '/admin/projects')}>{copy.backToProjects}</Link>
            </Button>
          }
        />
      </div>
    );
  }

  if (pageError && isEditing && !project) {
    return (
      <div className="page-enter">
        <StateCard
          eyebrow={dictionary.admin.navProjects}
          title={copy.loadErrorTitle}
          description={pageError}
          tone="warning"
          action={
            <Button type="button" size="lg" onClick={() => void loadProject()}>
              <RefreshCcw className="size-4" />
              {dictionary.admin.retry}
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="page-enter flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            {isEditing ? copy.editEyebrow : copy.createEyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
            {isEditing
              ? (localizedProject?.title ?? project?.slug ?? copy.fallbackTitle)
              : copy.newTitle}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
            {copy.description}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href={localizeHref(lang, '/admin/projects')}>
              <ArrowLeft className="size-4" />
              {copy.backToProjects}
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
              {copy.deleteAction}
            </Button>
          ) : null}
        </div>
      </section>

      {pageError ? (
        <div className="fade-enter rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {pageError}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <AdminProjectForm
          copy={copy}
          localeNames={dictionary.localeNames}
          formValues={formValues}
          fieldErrors={fieldErrors}
          activeLocale={activeLocale}
          technologyInput={technologyInput}
          isEditing={isEditing}
          saving={saving}
          uploading={uploading}
          onActiveLocaleChange={setActiveLocale}
          onTechnologyInputChange={setTechnologyInput}
          onAddTechnology={addTechnology}
          onRemoveTechnology={removeTechnology}
          onFieldChange={updateField}
          onLocalizedFieldChange={updateLocalizedField}
          onSubmit={handleSubmit}
        />

        <AdminProjectImagePanel
          copy={copy}
          publishedLabel={dictionary.admin.published}
          draftLabel={dictionary.admin.draft}
          featuredLabel={dictionary.admin.featured}
          previewImageUrl={previewImageUrl}
          previewImageAlt={previewImageAlt}
          selectedFile={selectedFile}
          fileError={fileError}
          published={formValues.published}
          featured={formValues.featured}
          liveUrl={formValues.liveUrl}
          isEditing={isEditing}
          uploading={uploading}
          usesUploadedImage={usesUploadedImage && Boolean(projectId)}
          onSelectedFileChange={handleSelectedFileChange}
          onUploadImage={() => void handleUploadImage()}
          onRemoveUploadedImage={() => void handleRemoveUploadedImage()}
        />
      </div>
    </div>
  );
}
