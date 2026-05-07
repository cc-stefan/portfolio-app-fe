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
    <section className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <Button asChild variant="ghost" className="-ml-3">
          <Link href={localizeHref(locale, '/')}>
            <ArrowLeft className="size-4" />
            {dictionary.project.backToHome}
          </Link>
        </Button>

        {project.featured ? <Badge variant="accent">{dictionary.common.featured}</Badge> : null}
      </div>

      <div className="max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          {dictionary.project.label}
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
          {project.title}
        </h1>
      </div>

      <Card variant="solid" className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-[16/9] bg-secondary">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={project.title}
                fill
                unoptimized
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
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
