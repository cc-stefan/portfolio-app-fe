import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Code2, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { localizeHref, localeTags, type AppLocale } from "../../i18n/routing";
import type { PortfolioDictionary } from "../../i18n/types";
import type { PortfolioProject } from "../../model/types";
import { formatProjectDate } from "../../lib/portfolio-formatters";
import { resolvePortfolioAssetUrl } from "../../lib/resolve-portfolio-asset-url";

interface ProjectHeroProps {
  locale: AppLocale;
  dictionary: PortfolioDictionary;
  project: PortfolioProject;
  apiOrigin: string;
}

function formatCount(value?: number) {
  return String(value ?? 0);
}

export function ProjectHero({
  locale,
  dictionary,
  project,
  apiOrigin,
}: ProjectHeroProps) {
  const coverImageUrl = resolvePortfolioAssetUrl(project.coverImageUrl, apiOrigin);
  const localizedDate = formatProjectDate(project.updatedAt, localeTags[locale]);

  return (
    <section className="grid gap-8 xl:grid-cols-[minmax(0,1.08fr)_22rem] xl:items-start">
      <div>
        <Button asChild variant="ghost" className="-ml-3">
          <Link href={localizeHref(locale, "/")}>
            <ArrowLeft className="size-4" />
            {dictionary.project.backToHome}
          </Link>
        </Button>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Badge variant="accent">{dictionary.project.label}</Badge>
          {project.featured ? (
            <Badge variant="neutral">{dictionary.common.featured}</Badge>
          ) : null}
          <Badge variant="success">{dictionary.common.published}</Badge>
        </div>

        <h1 className="mt-6 max-w-4xl text-balance text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
          {project.title}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
          {project.summary}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {project.liveUrl ? (
            <Button asChild size="lg">
              <Link href={project.liveUrl} target="_blank" rel="noreferrer">
                <Globe className="size-4" />
                {dictionary.actions.live}
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          ) : null}
          {project.repositoryUrl ? (
            <Button asChild variant="outline" size="lg">
              <Link
                href={project.repositoryUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Code2 className="size-4" />
                {dictionary.actions.code}
              </Link>
            </Button>
          ) : null}
        </div>

        <Card variant="solid" className="mt-8 overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-[16/9] bg-secondary">
              {coverImageUrl ? (
                <Image
                  src={coverImageUrl}
                  alt={project.title}
                  fill
                  unoptimized
                  sizes="(max-width: 1280px) 100vw, 70vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,var(--surface-muted),var(--card))] px-8 text-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    {project.title}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card variant="solid" className="xl:sticky xl:top-28">
        <CardContent className="p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            {dictionary.project.factsTitle}
          </p>
          <dl className="mt-6 grid gap-4">
            <Fact label={dictionary.common.lastUpdated} value={localizedDate} />
            <Fact
              label={dictionary.common.status}
              value={dictionary.common.published}
            />
            <Fact
              label={dictionary.common.displayOrder}
              value={project.displayOrder.toString()}
            />
            <Fact
              label={dictionary.common.technologies}
              value={formatCount(project.technologies.length)}
            />
          </dl>
        </CardContent>
      </Card>
    </section>
  );
}

interface FactProps {
  label: string;
  value: string;
}

function Fact({ label, value }: FactProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-4 last:border-b-0 last:pb-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-semibold text-foreground">{value}</dd>
    </div>
  );
}
