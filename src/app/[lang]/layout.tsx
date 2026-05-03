import type {Metadata} from "next";
import localFont from "next/font/local";
import {hasLocale, NextIntlClientProvider} from "next-intl";
import {setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {ThemeProvider} from "@/components/providers/theme-provider";
import {Toaster} from "@/components/ui/sonner";
import {getDictionary} from "@/features/portfolio/i18n/dictionaries";
import {appLocales, localeTags} from "@/features/portfolio/i18n/routing";
import {routing} from "@/i18n/routing";
import "../globals.css";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

const geistSans = localFont({
  src: "../../../node_modules/next/dist/next-devtools/server/font/geist-latin.woff2",
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = localFont({
  src: "../../../node_modules/next/dist/next-devtools/server/font/geist-mono-latin.woff2",
  variable: "--font-geist-mono",
  display: "swap",
});

const metadataBase = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");
  } catch {
    return new URL("http://localhost:3000");
  }
})();

export async function generateStaticParams() {
  return appLocales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { lang } = await params;

  if (!hasLocale(routing.locales, lang)) {
    return {};
  }

  const dictionary = await getDictionary(lang);

  return {
    metadataBase,
    applicationName: "Portfolio",
    title: {
      default: dictionary.meta.defaultTitle,
      template: `%s | ${dictionary.meta.siteName}`,
    },
    description: dictionary.meta.description,
    openGraph: {
      title: dictionary.meta.siteName,
      description: dictionary.meta.description,
      type: "website",
      locale: localeTags[lang],
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

  if (!hasLocale(routing.locales, lang)) {
    notFound();
  }

  setRequestLocale(lang);

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full bg-background text-foreground">
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            enableColorScheme={false}
            disableTransitionOnChange
          >
            <div className="min-h-full">{children}</div>
            <Toaster position="top-right" richColors closeButton />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
