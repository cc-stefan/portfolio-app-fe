export interface BackendErrorBody {
  errors?: Array<{ path?: string[]; message?: string }>;
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

export function getBackendFieldErrors(body: BackendErrorBody | null) {
  const fieldErrors: Record<string, string> = {};

  if (!body?.errors) {
    return fieldErrors;
  }

  for (const error of body.errors) {
    const field = error.path?.[0];

    if (field && error.message) {
      fieldErrors[field] = error.message;
    }
  }

  return fieldErrors;
}

export async function readBackendError(
  response: Response,
): Promise<BackendErrorBody | null> {
  try {
    return (await response.json()) as BackendErrorBody;
  } catch {
    return null;
  }
}

export function getBackendErrorMessage(
  body: BackendErrorBody | null,
  fallback: string,
) {
  if (!body) {
    return fallback;
  }

  if (Array.isArray(body.message) && body.message.length > 0) {
    return body.message[0] ?? fallback;
  }

  if (typeof body.message === "string" && body.message.trim()) {
    return body.message;
  }

  if (typeof body.error === "string" && body.error.trim()) {
    return body.error;
  }

  return fallback;
}

function isConflictMessage(message: string, pattern: RegExp) {
  return pattern.test(message) && /already|unique|exists|use/i.test(message);
}

export function getProjectSlugConflictMessage(
  body: BackendErrorBody | null,
  fallback: string,
) {
  const message = getBackendErrorMessage(body, "");
  return isConflictMessage(message, /slug/i)
    ? fallback
    : null;
}

export function getEmailConflictMessage(
  body: BackendErrorBody | null,
  fallback: string,
) {
  const message = getBackendErrorMessage(body, "");
  return isConflictMessage(message, /email/i)
    ? fallback
    : null;
}
