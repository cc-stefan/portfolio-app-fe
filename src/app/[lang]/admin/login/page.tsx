import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AdminLoginScreen } from '@/features/admin/components/admin-login-screen';
import { getDictionary } from '@/features/portfolio/i18n/dictionaries';
import { isAppLocale } from '@/features/portfolio/i18n/routing';

interface AdminLoginPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: AdminLoginPageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!isAppLocale(lang)) {
    return {};
  }

  const dictionary = await getDictionary(lang);

  return {
    title: dictionary.admin.loginLabel,
    description: dictionary.admin.loginDescription,
  };
}

export default async function AdminLoginPage({ params }: AdminLoginPageProps) {
  const { lang } = await params;

  if (!isAppLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);

  return <AdminLoginScreen lang={lang} dictionary={dictionary} />;
}
