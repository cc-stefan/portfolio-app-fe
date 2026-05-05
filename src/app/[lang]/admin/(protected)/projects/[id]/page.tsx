import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminProjectEditorScreen } from "@/features/admin/components/admin-project-editor-screen";
import { getDictionary } from "@/features/portfolio/i18n/dictionaries";
import { isAppLocale } from "@/features/portfolio/i18n/routing";

interface AdminProjectEditPageProps {
  params: Promise<{ lang: string; id: string }>;
}

export async function generateMetadata({
  params,
}: AdminProjectEditPageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!isAppLocale(lang)) {
    return {};
  }

  const dictionary = await getDictionary(lang);

  return {
    title: dictionary.admin.projectEditor.editEyebrow,
    description: dictionary.admin.projectEditor.description,
  };
}

export default async function AdminProjectEditPage({
  params,
}: AdminProjectEditPageProps) {
  const { lang, id } = await params;

  if (!isAppLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);

  return (
    <AdminProjectEditorScreen
      lang={lang}
      dictionary={dictionary}
      projectId={id}
    />
  );
}
