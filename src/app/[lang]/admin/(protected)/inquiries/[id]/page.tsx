import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminInquiryDetailScreen } from "@/features/admin/components/admin-inquiry-detail-screen";
import { isAppLocale } from "@/features/portfolio/i18n/routing";

interface AdminInquiryPageProps {
  params: Promise<{ lang: string; id: string }>;
}

export const metadata: Metadata = {
  title: "Inquiry detail",
  description: "Review and manage a portfolio inquiry in the admin back office.",
};

export default async function AdminInquiryPage({
  params,
}: AdminInquiryPageProps) {
  const { lang, id } = await params;

  if (!isAppLocale(lang)) {
    notFound();
  }

  return <AdminInquiryDetailScreen lang={lang} inquiryId={id} />;
}
