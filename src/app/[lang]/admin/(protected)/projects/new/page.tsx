import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminProjectEditorScreen } from "@/features/admin/components/admin-project-editor-screen";
import { isAppLocale } from "@/features/portfolio/i18n/routing";

interface AdminProjectNewPageProps {
  params: Promise<{ lang: string }>;
}

export const metadata: Metadata = {
  title: "New project",
  description: "Create a new project in the portfolio admin area.",
};

export default async function AdminProjectNewPage({
  params,
}: AdminProjectNewPageProps) {
  const { lang } = await params;

  if (!isAppLocale(lang)) {
    notFound();
  }

  return <AdminProjectEditorScreen lang={lang} />;
}
