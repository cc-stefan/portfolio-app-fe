import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { AdminAuthProvider } from '@/features/admin/auth/admin-auth-provider';
import { getDictionary } from '@/features/portfolio/i18n/dictionaries';
import { appLocales, localeTags } from '@/features/portfolio/i18n/routing';
import { getSiteUrl } from '@/features/seo/lib/site-url';
import { routing } from '@/i18n/routing';
import '../globals.css';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

const geistSans = Geist({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#151719' },
  ],
};

export async function generateStaticParams() {
  return appLocales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { lang } = await params;

  if (!hasLocale(routing.locales, lang)) {
    return {
      metadataBase: getSiteUrl(),
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const dictionary = await getDictionary(lang);

  return {
    metadataBase: getSiteUrl(),
    applicationName: dictionary.meta.siteName,
    authors: [{ name: dictionary.header.brand }],
    creator: dictionary.header.brand,
    publisher: dictionary.header.brand,
    title: {
      default: dictionary.meta.defaultTitle,
      template: `%s | ${dictionary.meta.siteName}`,
    },
    description: dictionary.meta.description,
    manifest: '/site.webmanifest',
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' },
        { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
        { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
        { url: '/favicon.ico', type: 'image/x-icon', sizes: '32x32' },
      ],
      shortcut: [{ url: '/favicon.ico', type: 'image/x-icon' }],
      apple: [{ url: '/apple-touch-icon.png', type: 'image/png', sizes: '180x180' }],
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: dictionary.meta.siteName,
      description: dictionary.meta.description,
      type: 'website',
      locale: localeTags[lang],
      alternateLocale: appLocales
        .filter((locale) => locale !== lang)
        .map((locale) => localeTags[locale]),
      siteName: dictionary.meta.siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title: dictionary.meta.siteName,
      description: dictionary.meta.description,
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { lang } = await params;

  if (!hasLocale(routing.locales, lang)) {
    notFound();
  }

  setRequestLocale(lang);
  const dictionary = await getDictionary(lang);

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="bg-background text-foreground">
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            enableColorScheme={false}
            disableTransitionOnChange
          >
            <AdminAuthProvider>
              <a
                href="#main-content"
                className="fixed left-4 top-4 z-50 -translate-y-24 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-transform focus:translate-y-0 focus:outline-none focus:ring-4 focus:ring-ring/45"
              >
                {dictionary.common.skipToContent}
              </a>
              <div className="min-h-full">{children}</div>
              <Toaster position="top-right" richColors closeButton />
            </AdminAuthProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
