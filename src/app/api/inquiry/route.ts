import { NextResponse } from "next/server";
import { buildBackendApiUrl } from "@/lib/backend";
import { inquiryFormSchema } from "@/features/portfolio/forms/inquiry-form-schema";

interface BackendErrorBody {
  errors?: Array<{ path?: string[]; message?: string }>;
  message?: string | string[];
  error?: string;
}

function getBackendErrorMessage(
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

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const result = inquiryFormSchema.safeParse(payload);

  if (!result.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Please review the form fields and try again.",
        errors: result.error.issues.map((issue) => ({
          path: issue.path.map(String),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(buildBackendApiUrl("/inquiries"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result.data),
      cache: "no-store",
    });

    const responseBody = (await response.json().catch(() => null)) as
      | (BackendErrorBody & { receivedAt?: string; createdAt?: string; id?: string })
      | null;

    if (!response.ok) {
      const status =
        response.status === 404 || response.status === 405 ? 503 : response.status;

      return NextResponse.json(
        {
          ok: false,
          errors: responseBody?.errors ?? [],
          message:
            status === 503
              ? "Inquiry backend endpoint is not available yet. Implement POST /api/inquiries in the backend."
              : getBackendErrorMessage(
                  responseBody,
                  "Unable to submit inquiry right now.",
                ),
        },
        { status },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        id: responseBody?.id,
        receivedAt:
          responseBody?.receivedAt ??
          responseBody?.createdAt ??
          new Date().toISOString(),
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message:
          "The inquiry backend is unavailable right now. Start the backend or implement POST /api/inquiries first.",
      },
      { status: 503 },
    );
  }
}
