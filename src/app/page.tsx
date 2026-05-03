import type { Metadata } from "next";
import { PortfolioHomeScreen } from "@/features/portfolio/screens/home-screen";
import { getDictionary } from "@/features/portfolio/i18n/dictionaries";
import { defaultLocale } from "@/features/portfolio/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = await getDictionary(defaultLocale);

  return {
    title: dictionary.meta.homeTitle,
    description: dictionary.meta.homeDescription,
  };
}

export default async function Home() {
  const dictionary = await getDictionary(defaultLocale);

  return (
    <PortfolioHomeScreen locale={defaultLocale} dictionary={dictionary} />
  );
}
