import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminProjectsScreen } from "@/features/admin/components/admin-projects-screen";
import { isAppLocale } from "@/features/portfolio/i18n/routing";

interface AdminProjectsPageProps {
  params: Promise<{ lang: string }>;
}

export const metadata: Metadata = {
  title: "Admin projects",
  description: "Project inventory and management for the portfolio backend.",
};

export default async function AdminProjectsPage({
  params,
}: AdminProjectsPageProps) {
  const { lang } = await params;

  if (!isAppLocale(lang)) {
    notFound();
  }

  return <AdminProjectsScreen lang={lang} />;
}
