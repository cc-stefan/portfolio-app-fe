import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StateCard } from '@/features/portfolio/components/state-card';
import { getDictionary } from '@/features/portfolio/i18n/dictionaries';
import { defaultLocale, localizeHref } from '@/features/portfolio/i18n/routing';

export default async function RootNotFoundPage() {
  const dictionary = await getDictionary(defaultLocale);

  return (
    <html lang={defaultLocale}>
      <body className="min-h-screen bg-background text-foreground">
        <div className="container-page flex min-h-[70vh] items-center py-16">
          <StateCard
            eyebrow="404"
            title={dictionary.meta.notFoundTitle}
            description={dictionary.meta.notFoundDescription}
            action={
              <Button asChild size="lg">
                <Link href={localizeHref(defaultLocale, '/')}>
                  {dictionary.actions.browseProjects}
                </Link>
              </Button>
            }
          />
        </div>
      </body>
    </html>
  );
}
