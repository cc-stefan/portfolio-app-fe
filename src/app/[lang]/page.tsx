import type {Metadata} from "next";
import {setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {PortfolioHomeScreen} from "@/features/portfolio/screens/home-screen";
import {getDictionary} from "@/features/portfolio/i18n/dictionaries";
import {isAppLocale} from "@/features/portfolio/i18n/routing";

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!isAppLocale(lang)) {
    return {};
  }

  const dictionary = await getDictionary(lang);

  return {
    title: dictionary.meta.homeTitle,
    description: dictionary.meta.homeDescription,
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;

  if (!isAppLocale(lang)) {
    notFound();
  }

  setRequestLocale(lang);

  const dictionary = await getDictionary(lang);

  return <PortfolioHomeScreen locale={lang} dictionary={dictionary} />;
}
