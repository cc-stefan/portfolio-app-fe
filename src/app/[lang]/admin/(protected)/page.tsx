import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminDashboardScreen } from "@/features/admin/components/admin-dashboard-screen";
import { isAppLocale } from "@/features/portfolio/i18n/routing";

interface AdminDashboardPageProps {
  params: Promise<{ lang: string }>;
}

export const metadata: Metadata = {
  title: "Admin dashboard",
  description: "Dashboard for managing the portfolio backend content.",
};

export default async function AdminDashboardPage({
  params,
}: AdminDashboardPageProps) {
  const { lang } = await params;

  if (!isAppLocale(lang)) {
    notFound();
  }

  return <AdminDashboardScreen lang={lang} />;
}
