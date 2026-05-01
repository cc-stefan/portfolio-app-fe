import { notFound } from "next/navigation";
import { AdminProtectedLayout } from "@/features/admin/components/admin-protected-layout";
import { isAppLocale } from "@/features/portfolio/i18n/routing";

interface AdminProtectedAreaLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function AdminProtectedAreaLayout({
  children,
  params,
}: AdminProtectedAreaLayoutProps) {
  const { lang } = await params;

  if (!isAppLocale(lang)) {
    notFound();
  }

  return <AdminProtectedLayout lang={lang}>{children}</AdminProtectedLayout>;
}
