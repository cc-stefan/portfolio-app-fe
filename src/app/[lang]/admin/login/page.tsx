import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminLoginScreen } from "@/features/admin/components/admin-login-screen";
import { isAppLocale } from "@/features/portfolio/i18n/routing";

interface AdminLoginPageProps {
  params: Promise<{ lang: string }>;
}

export const metadata: Metadata = {
  title: "Admin login",
  description: "Admin access for the portfolio back office.",
};

export default async function AdminLoginPage({ params }: AdminLoginPageProps) {
  const { lang } = await params;

  if (!isAppLocale(lang)) {
    notFound();
  }

  return <AdminLoginScreen lang={lang} />;
}
