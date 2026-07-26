import { NextResponse } from 'next/server';
import { buildBackendApiUrl } from '@/lib/backend';
import { createInquiryFormSchema } from '@/features/portfolio/forms/inquiry-form-schema';
import { getDictionary } from '@/features/portfolio/i18n/dictionaries';
import { defaultLocale, isAppLocale, type AppLocale } from '@/features/portfolio/i18n/routing';

interface BackendResponseBody {
  receivedAt?: string;
  createdAt?: string;
  id?: string;
}

function resolveRequestLocale(request: Request): AppLocale {
  const localeHeader = request.headers.get('x-app-locale');

  if (localeHeader && isAppLocale(localeHeader)) {
    return localeHeader;
  }

  return defaultLocale;
}

export async function POST(request: Request) {
  const locale = resolveRequestLocale(request);
  const dictionary = await getDictionary(locale);
  const inquiryFormSchema = createInquiryFormSchema(dictionary.inquiryForm);
  const payload = await request.json().catch(() => null);
  const result = inquiryFormSchema.safeParse(payload);

  if (!result.success) {
    return NextResponse.json(
      {
        ok: false,
        message: dictionary.inquiryForm.reviewError,
        errors: result.error.issues.map((issue) => ({
          path: issue.path.map(String),
          message: issue.message,
        })),
      },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(buildBackendApiUrl('/inquiries'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result.data),
      cache: 'no-store',
    });

    const responseBody = (await response.json().catch(() => null)) as BackendResponseBody | null;

    if (!response.ok) {
      const status = response.status === 404 || response.status === 405 ? 503 : response.status;

      return NextResponse.json(
        {
          ok: false,
          message:
            status === 503
              ? dictionary.inquiryForm.endpointUnavailableError
              : dictionary.inquiryForm.submitUnavailableError,
        },
        { status }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        id: responseBody?.id,
        receivedAt: responseBody?.receivedAt ?? responseBody?.createdAt ?? new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: dictionary.inquiryForm.backendUnavailableError,
      },
      { status: 503 }
    );
  }
}
