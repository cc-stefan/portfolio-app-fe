import { notFound } from "next/navigation";
import { AdminProtectedLayout } from "@/features/admin/components/admin-protected-layout";
import { getDictionary } from "@/features/portfolio/i18n/dictionaries";
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

  const dictionary = await getDictionary(lang);

  return (
    <AdminProtectedLayout lang={lang} dictionary={dictionary}>
      {children}
    </AdminProtectedLayout>
  );
}
