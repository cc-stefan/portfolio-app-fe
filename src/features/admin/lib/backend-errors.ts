export interface BackendErrorBody {
  errors?: Array<{ path?: string[]; message?: string }>;
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

export function getBackendFieldErrors(_body: BackendErrorBody | null): Record<string, string> {
  // Server validation details can contain implementation language that is not suitable for the UI.
  void _body;
  return {};
}

export async function readBackendError(response: Response): Promise<BackendErrorBody | null> {
  try {
    return (await response.json()) as BackendErrorBody;
  } catch {
    return null;
  }
}

function getRawBackendErrorMessage(body: BackendErrorBody | null, fallback: string) {
  if (!body) {
    return fallback;
  }

  if (Array.isArray(body.message) && body.message.length > 0) {
    return body.message[0] ?? fallback;
  }

  if (typeof body.message === 'string' && body.message.trim()) {
    return body.message;
  }

  if (typeof body.error === 'string' && body.error.trim()) {
    return body.error;
  }

  return fallback;
}

export function getBackendErrorMessage(_body: BackendErrorBody | null, fallback: string) {
  void _body;
  return fallback;
}

function isConflictMessage(message: string, pattern: RegExp) {
  return pattern.test(message) && /already|unique|exists|use/i.test(message);
}

export function getProjectSlugConflictMessage(body: BackendErrorBody | null, fallback: string) {
  const message = getRawBackendErrorMessage(body, '');
  return isConflictMessage(message, /slug/i) ? fallback : null;
}

export function getEmailConflictMessage(body: BackendErrorBody | null, fallback: string) {
  const message = getRawBackendErrorMessage(body, '');
  return isConflictMessage(message, /email/i) ? fallback : null;
}
