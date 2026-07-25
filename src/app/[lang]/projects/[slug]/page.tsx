import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getProjectBySlug } from '@/features/portfolio/api/portfolio-api';
import { PortfolioProjectScreen } from '@/features/portfolio/screens/project-screen';
import { PortfolioProjectLoadingScreen } from '@/features/portfolio/screens/project-loading-screen';
import { getDictionary } from '@/features/portfolio/i18n/dictionaries';
import { isAppLocale } from '@/features/portfolio/i18n/routing';
import { getPortfolioProjectMetadata } from '@/features/portfolio/api/portfolio-metadata';

interface ProjectPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { lang, slug } = await params;

  if (!isAppLocale(lang)) {
    return {};
  }

  const dictionary = await getDictionary(lang);

  return getPortfolioProjectMetadata(slug, lang, dictionary);
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { lang, slug } = await params;

  if (!isAppLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);
  const projectResult = await getProjectBySlug(slug, lang);

  if (projectResult.status === 404) {
    notFound();
  }

  return (
    <Suspense fallback={<PortfolioProjectLoadingScreen />}>
      <PortfolioProjectScreen slug={slug} locale={lang} dictionary={dictionary} />
    </Suspense>
  );
}
