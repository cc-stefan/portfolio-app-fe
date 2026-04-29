import { NextResponse } from "next/server";
import { inquiryFormSchema } from "@/features/portfolio/forms/inquiry-form-schema";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const result = inquiryFormSchema.safeParse(payload);

  if (!result.success) {
    return NextResponse.json(
      {
        ok: false,
        errors: result.error.issues.map((issue) => ({
          path: issue.path.map(String),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    receivedAt: new Date().toISOString(),
  });
}
