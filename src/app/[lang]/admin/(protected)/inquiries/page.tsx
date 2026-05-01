import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminInquiriesScreen } from "@/features/admin/components/admin-inquiries-screen";
import { isAppLocale } from "@/features/portfolio/i18n/routing";

interface AdminInquiriesPageProps {
  params: Promise<{ lang: string }>;
}

export const metadata: Metadata = {
  title: "Admin inquiries",
  description: "Inquiry inbox and workflow management for the portfolio backend.",
};

export default async function AdminInquiriesPage({
  params,
}: AdminInquiriesPageProps) {
  const { lang } = await params;

  if (!isAppLocale(lang)) {
    notFound();
  }

  return <AdminInquiriesScreen lang={lang} />;
}
