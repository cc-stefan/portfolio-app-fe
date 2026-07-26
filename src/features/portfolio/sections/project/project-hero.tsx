import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { localizeHref, type AppLocale } from '../../i18n/routing';
import type { PortfolioDictionary } from '../../i18n/types';
import type { PortfolioProject } from '../../model/types';
import { resolvePortfolioAssetUrl } from '../../lib/resolve-portfolio-asset-url';

interface ProjectHeroProps {
  locale: AppLocale;
  dictionary: PortfolioDictionary;
  project: PortfolioProject;
  apiOrigin: string;
}

export function ProjectHero({ locale, dictionary, project, apiOrigin }: ProjectHeroProps) {
  const imageUrl = resolvePortfolioAssetUrl(project.imageUrl, apiOrigin);

  return (
    <section className="grid gap-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <nav aria-label={dictionary.project.breadcrumbLabel}>
          <ol>
            <li>
              <Button asChild variant="ghost" className="-ml-3">
                <Link href={localizeHref(locale, '/')}>
                  <ArrowLeft className="size-4" />
                  {dictionary.project.backToHome}
                </Link>
              </Button>
            </li>
            <li className="sr-only" aria-current="page">
              {project.title}
            </li>
          </ol>
        </nav>

        {project.featured ? <Badge variant="featured">{dictionary.common.featured}</Badge> : null}
      </div>

      <div className="max-w-5xl">
        <p className="section-kicker">{dictionary.project.label}</p>
        <h1 className="mt-4 max-w-[16ch] text-balance text-4xl font-semibold leading-[1] tracking-[-0.05em] text-foreground sm:text-5xl lg:text-6xl">
          {project.title}
        </h1>
      </div>

      <Card variant="solid" className="overflow-hidden rounded-[calc(var(--radius)+0.5rem)]">
        <CardContent className="p-0">
          <div className="relative aspect-[4/3] bg-secondary/80 sm:aspect-[16/9] lg:aspect-[2/1]">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={project.title}
                fill
                unoptimized
                preload
                sizes="100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,var(--surface-muted),var(--card))] px-8 text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  {dictionary.project.noProjectImage}
                </p>
              </div>
            )}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/35 to-transparent"
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
