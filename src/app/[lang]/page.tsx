import type { Metadata } from 'next';
import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { PortfolioHomeLoadingScreen } from '@/features/portfolio/screens/home-loading-screen';
import { PortfolioHomeScreen } from '@/features/portfolio/screens/home-screen';
import { getDictionary } from '@/features/portfolio/i18n/dictionaries';
import { appLocales, isAppLocale, localeTags } from '@/features/portfolio/i18n/routing';
import { getLanguageAlternates, getLocalizedUrl } from '@/features/seo/lib/site-url';

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!isAppLocale(lang)) {
    return {};
  }

  const dictionary = await getDictionary(lang);

  return {
    title: dictionary.meta.homeTitle,
    description: dictionary.meta.homeDescription,
    alternates: {
      canonical: getLocalizedUrl(lang),
      languages: getLanguageAlternates('/'),
    },
    openGraph: {
      title: dictionary.meta.homeTitle,
      description: dictionary.meta.homeDescription,
      type: 'website',
      url: getLocalizedUrl(lang),
      locale: localeTags[lang],
      siteName: dictionary.meta.siteName,
      alternateLocale: appLocales
        .filter((locale) => locale !== lang)
        .map((locale) => localeTags[locale]),
    },
    twitter: {
      card: 'summary_large_image',
      title: dictionary.meta.homeTitle,
      description: dictionary.meta.homeDescription,
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;

  if (!isAppLocale(lang)) {
    notFound();
  }

  setRequestLocale(lang);

  const dictionary = await getDictionary(lang);

  return (
    <Suspense fallback={<PortfolioHomeLoadingScreen />}>
      <PortfolioHomeScreen locale={lang} dictionary={dictionary} />
    </Suspense>
  );
}
