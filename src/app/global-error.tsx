'use client';

import { Button } from '@/components/ui/button';
import { defaultLocale, isAppLocale } from '@/features/portfolio/i18n/routing';
import { dictionary as enDictionary } from '@/features/portfolio/i18n/messages/en';
import { dictionary as roDictionary } from '@/features/portfolio/i18n/messages/ro';

const dictionaries = {
  en: enDictionary,
  ro: roDictionary,
};

function resolveErrorLocale() {
  if (typeof window === 'undefined') {
    return defaultLocale;
  }

  const localeSegment = window.location.pathname.split('/')[1] ?? defaultLocale;
  return isAppLocale(localeSegment) ? localeSegment : defaultLocale;
}

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = resolveErrorLocale();
  const copy = dictionaries[locale].globalError;

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-background text-foreground">
        <div className="container-page flex min-h-screen items-center justify-center py-16">
          <div className="max-w-md space-y-4 text-center">
            <h1 className="text-3xl font-semibold text-foreground">{copy.title}</h1>
            <p className="text-sm leading-7 text-muted-foreground">{copy.description}</p>
            <Button type="button" size="lg" onClick={() => reset()}>
              {copy.resetAction}
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
