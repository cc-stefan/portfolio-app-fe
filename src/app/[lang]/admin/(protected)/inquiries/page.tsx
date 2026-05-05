import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminInquiriesScreen } from "@/features/admin/components/admin-inquiries-screen";
import { getDictionary } from "@/features/portfolio/i18n/dictionaries";
import { isAppLocale } from "@/features/portfolio/i18n/routing";

interface AdminInquiriesPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: AdminInquiriesPageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!isAppLocale(lang)) {
    return {};
  }

  const dictionary = await getDictionary(lang);

  return {
    title: dictionary.admin.inquiriesPage.title,
    description: dictionary.admin.inquiriesPage.description,
  };
}

export default async function AdminInquiriesPage({
  params,
}: AdminInquiriesPageProps) {
  const { lang } = await params;

  if (!isAppLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);

  return <AdminInquiriesScreen lang={lang} dictionary={dictionary} />;
}
