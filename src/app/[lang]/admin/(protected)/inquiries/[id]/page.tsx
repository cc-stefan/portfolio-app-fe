import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AdminInquiryDetailScreen } from '@/features/admin/components/admin-inquiry-detail-screen';
import { getDictionary } from '@/features/portfolio/i18n/dictionaries';
import { isAppLocale } from '@/features/portfolio/i18n/routing';

interface AdminInquiryPageProps {
  params: Promise<{ lang: string; id: string }>;
}

export async function generateMetadata({ params }: AdminInquiryPageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!isAppLocale(lang)) {
    return {};
  }

  const dictionary = await getDictionary(lang);

  return {
    title: dictionary.admin.inquiryDetailPage.eyebrow,
    description: dictionary.admin.inquiryDetailPage.description,
  };
}

export default async function AdminInquiryPage({ params }: AdminInquiryPageProps) {
  const { lang, id } = await params;

  if (!isAppLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);

  return <AdminInquiryDetailScreen lang={lang} inquiryId={id} dictionary={dictionary} />;
}
