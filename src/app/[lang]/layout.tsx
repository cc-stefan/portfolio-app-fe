import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/features/portfolio/i18n/dictionaries";
import {
  appLocales,
  isAppLocale,
  localeTags,
} from "@/features/portfolio/i18n/routing";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return appLocales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { lang } = await params;

  if (!isAppLocale(lang)) {
    return {};
  }

  const dictionary = await getDictionary(lang);

  return {
    title: {
      default: dictionary.meta.defaultTitle,
      template: `%s | ${dictionary.meta.siteName}`,
    },
    description: dictionary.meta.description,
    openGraph: {
      title: dictionary.meta.siteName,
      description: dictionary.meta.description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dictionary.meta.siteName,
      description: dictionary.meta.description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { lang } = await params;

  if (!isAppLocale(lang)) {
    notFound();
  }

  return (
    <div lang={localeTags[lang]} className="min-h-full">
      {children}
    </div>
  );
}
