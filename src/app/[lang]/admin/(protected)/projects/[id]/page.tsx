import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminProjectEditorScreen } from "@/features/admin/components/admin-project-editor-screen";
import { isAppLocale } from "@/features/portfolio/i18n/routing";

interface AdminProjectEditPageProps {
  params: Promise<{ lang: string; id: string }>;
}

export const metadata: Metadata = {
  title: "Edit project",
  description: "Edit a portfolio project in the admin back office.",
};

export default async function AdminProjectEditPage({
  params,
}: AdminProjectEditPageProps) {
  const { lang, id } = await params;

  if (!isAppLocale(lang)) {
    notFound();
  }

  return <AdminProjectEditorScreen lang={lang} projectId={id} />;
}
