import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminProjectEditorScreen } from "@/features/admin/components/admin-project-editor-screen";
import { getDictionary } from "@/features/portfolio/i18n/dictionaries";
import { isAppLocale } from "@/features/portfolio/i18n/routing";

interface AdminProjectNewPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: AdminProjectNewPageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!isAppLocale(lang)) {
    return {};
  }

  const dictionary = await getDictionary(lang);

  return {
    title: dictionary.admin.projectEditor.createEyebrow,
    description: dictionary.admin.projectEditor.description,
  };
}

export default async function AdminProjectNewPage({
  params,
}: AdminProjectNewPageProps) {
  const { lang } = await params;

  if (!isAppLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);

  return <AdminProjectEditorScreen lang={lang} dictionary={dictionary} />;
}
