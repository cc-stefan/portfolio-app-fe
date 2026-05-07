import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AdminProjectsScreen } from '@/features/admin/components/admin-projects-screen';
import { getDictionary } from '@/features/portfolio/i18n/dictionaries';
import { isAppLocale } from '@/features/portfolio/i18n/routing';

interface AdminProjectsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: AdminProjectsPageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!isAppLocale(lang)) {
    return {};
  }

  const dictionary = await getDictionary(lang);

  return {
    title: dictionary.admin.projectsPage.title,
    description: dictionary.admin.projectsPage.description,
  };
}

export default async function AdminProjectsPage({ params }: AdminProjectsPageProps) {
  const { lang } = await params;

  if (!isAppLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);

  return <AdminProjectsScreen lang={lang} dictionary={dictionary} />;
}
