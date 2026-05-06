import { isBackendUploadPath, resolveBackendAssetUrl } from "@/lib/backend";
import type { PortfolioDictionary } from "@/features/portfolio/i18n/types";
import {
  appLocales,
  defaultLocale,
  type AppLocale,
} from "@/features/portfolio/i18n/routing";
import { resolveProjectTranslation } from "@/features/portfolio/lib/project-translations";
import type {
  AdminProject,
  ProjectFieldErrors,
  ProjectFieldName,
  ProjectFormValues,
  ProjectLocalizedFieldName,
  ProjectMutationPayload,
  ProjectTranslationFormValues,
} from "../model/types";

type ProjectEditorCopy = PortfolioDictionary["admin"]["projectEditor"];

export const PROJECT_IMAGE_MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_PROJECT_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function trimOptional(value: string) {
  return value.trim();
}

function normalizeOptionalField(value: string) {
  const trimmed = trimOptional(value);
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeNullableField(value: string) {
  const trimmed = trimOptional(value);
  return trimmed.length > 0 ? trimmed : null;
}

function createEmptyTranslationValues(): ProjectTranslationFormValues {
  return {
    title: "",
    summary: "",
    description: "",
  };
}

function createEmptyTranslationsByLocale(): Record<
  AppLocale,
  ProjectTranslationFormValues
> {
  return Object.fromEntries(
    appLocales.map((locale) => [locale, createEmptyTranslationValues()]),
  ) as Record<AppLocale, ProjectTranslationFormValues>;
}

function buildTranslationsPayload(values: ProjectFormValues) {
  return appLocales.flatMap((locale) => {
    const translation = values.translations[locale];
    const title = translation.title.trim();
    const summary = translation.summary.trim();
    const description = translation.description.trim();

    if (!title && !summary && !description) {
      return [];
    }

    return [
      {
        locale,
        title,
        summary,
        description: description || null,
      },
    ];
  });
}

function normalizeTechnologies(technologies: string[]) {
  const uniqueValues = new Set<string>();

  for (const technology of technologies) {
    const trimmed = technology.trim();

    if (trimmed) {
      uniqueValues.add(trimmed);
    }
  }

  return Array.from(uniqueValues);
}

function isValidProjectDateInput(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsedValue = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(parsedValue.getTime()) &&
    parsedValue.toISOString().slice(0, 10) === value
  );
}

function toProjectDatePayload(value: string) {
  const trimmed = trimOptional(value);

  if (!trimmed) {
    return undefined;
  }

  return new Date(`${trimmed}T00:00:00.000Z`).toISOString();
}

function toNullableProjectDatePayload(value: string) {
  const trimmed = trimOptional(value);

  if (!trimmed) {
    return null;
  }

  return new Date(`${trimmed}T00:00:00.000Z`).toISOString();
}

export function getLocalizedProjectFieldPath(
  locale: AppLocale,
  field: ProjectLocalizedFieldName,
): Extract<ProjectFieldName, `translations.${AppLocale}.${string}`> {
  return `translations.${locale}.${field}`;
}

export function createEmptyProjectFormValues(): ProjectFormValues {
  return {
    translations: createEmptyTranslationsByLocale(),
    slug: "",
    liveUrl: "",
    repositoryUrl: "",
    projectDate: "",
    technologies: [],
    featured: false,
    published: false,
    displayOrder: "",
  };
}

export function createProjectFormValues(
  project: AdminProject,
): ProjectFormValues {
  const translations = createEmptyTranslationsByLocale();

  for (const locale of appLocales) {
    const translation = resolveProjectTranslation(project.translations, locale);

    if (!translation || translation.locale !== locale) {
      continue;
    }

    translations[locale] = {
      title: translation.title,
      summary: translation.summary,
      description: translation.description ?? "",
    };
  }

  return {
    translations,
    slug: project.slug,
    liveUrl: project.liveUrl ?? "",
    repositoryUrl: project.repositoryUrl ?? "",
    projectDate: project.projectDate?.slice(0, 10) ?? "",
    technologies: project.technologies,
    featured: project.featured,
    published: project.published,
    displayOrder: project.displayOrder.toString(),
  };
}

export function validateProjectForm(
  values: ProjectFormValues,
  copy: ProjectEditorCopy,
): ProjectFieldErrors {
  const errors: ProjectFieldErrors = {};
  const slug = values.slug.trim();
  const liveUrl = values.liveUrl.trim();
  const repositoryUrl = values.repositoryUrl.trim();
  const projectDate = values.projectDate.trim();
  const technologies = normalizeTechnologies(values.technologies);
  const displayOrder = values.displayOrder.trim();

  for (const locale of appLocales) {
    const translation = values.translations[locale];
    const title = translation.title.trim();
    const summary = translation.summary.trim();
    const description = translation.description.trim();
    const hasAnyLocalizedContent = Boolean(title || summary || description);

    if (locale === defaultLocale || hasAnyLocalizedContent) {
      if (!title) {
        errors[getLocalizedProjectFieldPath(locale, "title")] =
          copy.validation.titleRequired;
      } else if (title.length > 120) {
        errors[getLocalizedProjectFieldPath(locale, "title")] =
          copy.validation.titleMaxLength;
      }

      if (!summary) {
        errors[getLocalizedProjectFieldPath(locale, "summary")] =
          copy.validation.summaryRequired;
      } else if (summary.length > 300) {
        errors[getLocalizedProjectFieldPath(locale, "summary")] =
          copy.validation.summaryMaxLength;
      }
    }

    if (description.length > 5000) {
      errors[getLocalizedProjectFieldPath(locale, "description")] =
        copy.validation.descriptionMaxLength;
    }
  }

  if (slug) {
    if (slug.length > 160) {
      errors.slug = copy.validation.slugMaxLength;
    } else if (!SLUG_PATTERN.test(slug)) {
      errors.slug = copy.validation.slugPattern;
    }
  }

  if (projectDate && !isValidProjectDateInput(projectDate)) {
    errors.projectDate = copy.validation.projectDateInvalid;
  }

  if (liveUrl.length > 500) {
    errors.liveUrl = copy.validation.liveUrlMaxLength;
  }

  if (repositoryUrl.length > 500) {
    errors.repositoryUrl = copy.validation.repositoryUrlMaxLength;
  }

  if (technologies.length > 20) {
    errors.technologies = copy.validation.technologiesMaxItems;
  } else if (technologies.some((technology) => technology.length > 40)) {
    errors.technologies = copy.validation.technologyMaxLength;
  }

  if (displayOrder) {
    const parsedValue = Number(displayOrder);

    if (!Number.isInteger(parsedValue) || parsedValue < 0) {
      errors.displayOrder = copy.validation.displayOrderInvalid;
    }
  }

  return errors;
}

function buildSharedProjectPayload(
  values: ProjectFormValues,
): Omit<ProjectMutationPayload, "slug"> & { slug?: string } {
  const payload: ProjectMutationPayload = {
    translations: buildTranslationsPayload(values),
    featured: values.featured,
    published: values.published,
  };

  const displayOrder = values.displayOrder.trim();

  if (displayOrder) {
    payload.displayOrder = Number(displayOrder);
  }

  return payload;
}

export function buildCreateProjectPayload(
  values: ProjectFormValues,
): ProjectMutationPayload {
  const payload = buildSharedProjectPayload(values);
  const slug = normalizeOptionalField(values.slug);
  const liveUrl = normalizeOptionalField(values.liveUrl);
  const repositoryUrl = normalizeOptionalField(values.repositoryUrl);
  const projectDate = toProjectDatePayload(values.projectDate);
  const technologies = normalizeTechnologies(values.technologies);

  if (slug) {
    payload.slug = slug;
  }

  if (liveUrl) {
    payload.liveUrl = liveUrl;
  }

  if (repositoryUrl) {
    payload.repositoryUrl = repositoryUrl;
  }

  if (projectDate) {
    payload.projectDate = projectDate;
  }

  if (technologies.length > 0) {
    payload.technologies = technologies;
  }

  return payload;
}

export function buildUpdateProjectPayload(
  values: ProjectFormValues,
): ProjectMutationPayload {
  const payload = buildSharedProjectPayload(values);
  const slug = normalizeOptionalField(values.slug);

  if (slug) {
    payload.slug = slug;
  }

  payload.liveUrl = normalizeNullableField(values.liveUrl);
  payload.repositoryUrl = normalizeNullableField(values.repositoryUrl);
  payload.projectDate = toNullableProjectDatePayload(values.projectDate);
  payload.technologies = normalizeTechnologies(values.technologies);

  return payload;
}

export function getProjectFileValidationError(
  file: File | null,
  copy: ProjectEditorCopy,
) {
  if (!file) {
    return null;
  }

  if (!ALLOWED_PROJECT_IMAGE_MIME_TYPES.has(file.type)) {
    return copy.validation.fileTypeInvalid;
  }

  if (file.size > PROJECT_IMAGE_MAX_FILE_SIZE_BYTES) {
    return copy.validation.fileSizeInvalid;
  }

  return null;
}

export function resolveProjectImageUrl(value: string | null) {
  return resolveBackendAssetUrl(value);
}

export function isUploadedProjectImage(value: string | null) {
  return isBackendUploadPath(value);
}
