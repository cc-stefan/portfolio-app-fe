import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminDashboardScreen } from "@/features/admin/components/admin-dashboard-screen";
import { getDictionary } from "@/features/portfolio/i18n/dictionaries";
import { isAppLocale } from "@/features/portfolio/i18n/routing";

interface AdminDashboardPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: AdminDashboardPageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!isAppLocale(lang)) {
    return {};
  }

  const dictionary = await getDictionary(lang);

  return {
    title: dictionary.admin.dashboardTitle,
    description: dictionary.admin.dashboardDescription,
  };
}

export default async function AdminDashboardPage({
  params,
}: AdminDashboardPageProps) {
  const { lang } = await params;

  if (!isAppLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);

  return <AdminDashboardScreen lang={lang} dictionary={dictionary} />;
}
