import { isBackendUploadPath, resolveBackendAssetUrl } from "@/lib/backend";
import type {
  AdminProject,
  ProjectFieldErrors,
  ProjectFormValues,
  ProjectMutationPayload,
} from "../model/types";

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

export function createEmptyProjectFormValues(): ProjectFormValues {
  return {
    title: "",
    slug: "",
    summary: "",
    description: "",
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
  return {
    title: project.title,
    slug: project.slug,
    summary: project.summary,
    description: project.description ?? "",
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
): ProjectFieldErrors {
  const errors: ProjectFieldErrors = {};
  const title = values.title.trim();
  const slug = values.slug.trim();
  const summary = values.summary.trim();
  const description = values.description.trim();
  const liveUrl = values.liveUrl.trim();
  const repositoryUrl = values.repositoryUrl.trim();
  const projectDate = values.projectDate.trim();
  const technologies = normalizeTechnologies(values.technologies);
  const displayOrder = values.displayOrder.trim();

  if (!title) {
    errors.title = "Title is required";
  } else if (title.length > 120) {
    errors.title = "Title must be 120 characters or less";
  }

  if (slug) {
    if (slug.length > 160) {
      errors.slug = "Slug must be 160 characters or less";
    } else if (!SLUG_PATTERN.test(slug)) {
      errors.slug = "Slug must use lowercase kebab-case";
    }
  }

  if (!summary) {
    errors.summary = "Summary is required";
  } else if (summary.length > 300) {
    errors.summary = "Summary must be 300 characters or less";
  }

  if (description.length > 5000) {
    errors.description = "Description must be 5000 characters or less";
  }

  if (projectDate && !isValidProjectDateInput(projectDate)) {
    errors.projectDate = "Project date must be a valid calendar date";
  }

  if (liveUrl.length > 500) {
    errors.liveUrl = "Live URL must be 500 characters or less";
  }

  if (repositoryUrl.length > 500) {
    errors.repositoryUrl = "Repository URL must be 500 characters or less";
  }

  if (technologies.length > 20) {
    errors.technologies = "You can add up to 20 technologies";
  } else if (technologies.some((technology) => technology.length > 40)) {
    errors.technologies = "Each technology must be 40 characters or less";
  }

  if (displayOrder) {
    const parsedValue = Number(displayOrder);

    if (!Number.isInteger(parsedValue) || parsedValue < 0) {
      errors.displayOrder =
        "Display order must be a whole number greater than or equal to 0";
    }
  }

  return errors;
}

function buildSharedProjectPayload(
  values: ProjectFormValues,
): Omit<ProjectMutationPayload, "slug"> & { slug?: string } {
  const payload: ProjectMutationPayload = {
    title: values.title.trim(),
    summary: values.summary.trim(),
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
  const description = normalizeOptionalField(values.description);
  const liveUrl = normalizeOptionalField(values.liveUrl);
  const repositoryUrl = normalizeOptionalField(values.repositoryUrl);
  const projectDate = toProjectDatePayload(values.projectDate);
  const technologies = normalizeTechnologies(values.technologies);

  if (slug) {
    payload.slug = slug;
  }

  if (description) {
    payload.description = description;
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

  payload.description = normalizeNullableField(values.description);
  payload.liveUrl = normalizeNullableField(values.liveUrl);
  payload.repositoryUrl = normalizeNullableField(values.repositoryUrl);
  payload.projectDate = toNullableProjectDatePayload(values.projectDate);
  payload.technologies = normalizeTechnologies(values.technologies);

  return payload;
}

export function getProjectFileValidationError(file: File | null) {
  if (!file) {
    return null;
  }

  if (!ALLOWED_PROJECT_IMAGE_MIME_TYPES.has(file.type)) {
    return "Project image must be JPEG, PNG, WEBP, GIF, or AVIF";
  }

  if (file.size > PROJECT_IMAGE_MAX_FILE_SIZE_BYTES) {
    return "Project image must be 5 MB or smaller";
  }

  return null;
}

export function resolveProjectImageUrl(value: string | null) {
  return resolveBackendAssetUrl(value);
}

export function isUploadedProjectImage(value: string | null) {
  return isBackendUploadPath(value);
}
