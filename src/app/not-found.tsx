import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StateCard } from '@/features/portfolio/components/state-card';
import { getDictionary } from '@/features/portfolio/i18n/dictionaries';
import { defaultLocale, localizeHref } from '@/features/portfolio/i18n/routing';
import './globals.css';

export default async function RootNotFoundPage() {
  const dictionary = await getDictionary(defaultLocale);

  return (
    <html lang={defaultLocale}>
      <body className="bg-background text-foreground">
        <main className="container-page flex min-h-[var(--app-viewport-height)] items-center py-16">
          <StateCard
            eyebrow="404"
            title={dictionary.meta.notFoundTitle}
            description={dictionary.meta.notFoundDescription}
            titleAs="h1"
            action={
              <Button asChild size="lg">
                <Link href={localizeHref(defaultLocale, '/')}>
                  {dictionary.actions.browseProjects}
                </Link>
              </Button>
            }
          />
        </main>
      </body>
    </html>
  );
}
