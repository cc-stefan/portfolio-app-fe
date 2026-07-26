import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Code2, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { localizeHref, type AppLocale } from '../i18n/routing';
import type { PortfolioProject } from '../model/types';
import { formatProjectMonth } from '../lib/portfolio-formatters';
import { resolvePortfolioAssetUrl } from '../lib/resolve-portfolio-asset-url';

export interface ProjectCardCopy {
  featured: string;
  noTechnologies: string;
  viewProject: string;
  live: string;
  code: string;
}

interface ProjectCardProps {
  project: PortfolioProject;
  locale: AppLocale;
  copy: ProjectCardCopy;
  apiOrigin: string;
  showPriorityBadge?: boolean;
}

export function ProjectCard({
  project,
  locale,
  copy,
  apiOrigin,
  showPriorityBadge = true,
}: ProjectCardProps) {
  const projectHref = localizeHref(locale, `/projects/${project.slug}`);
  const imageUrl = resolvePortfolioAssetUrl(project.imageUrl, apiOrigin);
  const projectMonth = formatProjectMonth(project.projectDate, locale);

  return (
    <Card variant="interactive" className="group h-full overflow-hidden">
      <Link
        href={projectHref}
        className="block focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/45"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-secondary/80">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={project.title}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,var(--surface-muted),var(--card))] px-8 text-center">
              <p className="text-sm font-medium text-muted-foreground">{project.title}</p>
            </div>
          )}
          <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {showPriorityBadge && project.featured ? (
                <Badge variant="featured">{copy.featured}</Badge>
              ) : null}
              {projectMonth ? <Badge variant="neutral">{projectMonth}</Badge> : null}
            </div>
            <span className="inline-flex size-9 items-center justify-center rounded-lg border border-border/70 bg-card/88 text-foreground shadow-sm backdrop-blur-md transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight className="size-4" />
            </span>
          </div>
        </div>
      </Link>

      <CardContent className="flex flex-1 flex-col p-5">
        <Link
          href={projectHref}
          className="text-xl font-semibold tracking-[-0.025em] text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/45"
        >
          {project.title}
        </Link>
        <p className="mt-3 line-clamp-3 max-w-xl text-sm leading-7 text-muted-foreground">
          {project.summary}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.technologies.length > 0 ? (
            project.technologies.slice(0, 4).map((technology) => (
              <Badge key={technology} variant="outline">
                {technology}
              </Badge>
            ))
          ) : (
            <Badge variant="outline">{copy.noTechnologies}</Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="mt-auto flex flex-wrap items-center gap-2 p-5 pt-0">
        <Button asChild variant="secondary" size="sm">
          <Link href={projectHref}>{copy.viewProject}</Link>
        </Button>
        {project.liveUrl ? (
          <Button asChild variant="ghost" size="sm">
            <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <Globe className="size-4" />
              {copy.live}
            </Link>
          </Button>
        ) : null}
        {project.repositoryUrl ? (
          <Button asChild variant="ghost" size="sm">
            <Link href={project.repositoryUrl} target="_blank" rel="noopener noreferrer">
              <Code2 className="size-4" />
              {copy.code}
            </Link>
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}
