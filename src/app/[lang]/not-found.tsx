import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { StateCard } from '@/features/portfolio/components/state-card';
import { getDictionary } from '@/features/portfolio/i18n/dictionaries';
import { defaultLocale, isAppLocale, localizeHref } from '@/features/portfolio/i18n/routing';

export default async function LocaleNotFound() {
  const requestedLocale = await getLocale();
  const locale = isAppLocale(requestedLocale) ? requestedLocale : defaultLocale;
  const dictionary = await getDictionary(locale);

  return (
    <div className="container-page flex min-h-[70vh] items-center py-16">
      <StateCard
        eyebrow="404"
        title={dictionary.meta.notFoundTitle}
        description={dictionary.meta.notFoundDescription}
        action={
          <Button asChild size="lg">
            <Link href={localizeHref(locale, '/')}>{dictionary.actions.browseProjects}</Link>
          </Button>
        }
      />
    </div>
  );
}
