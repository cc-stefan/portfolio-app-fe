import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { AppLocale } from '../../i18n/routing';
import { localizeHref } from '../../i18n/routing';
import type { PortfolioDictionary } from '../../i18n/types';
import { SectionScrollLink } from '../../components/section-scroll-link';

interface HomeHeroProps {
  locale: AppLocale;
  copy: PortfolioDictionary['home'];
}

export function HomeHero({ locale, copy }: HomeHeroProps) {
  return (
    <section
      id="home"
      className="anchor-target grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)] lg:items-center"
    >
      <div>
        <h1 className="max-w-5xl text-balance text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
          {copy.title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">{copy.description}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <SectionScrollLink href={localizeHref(locale, '/#projects')}>
              {copy.primaryCta}
              <ArrowRight className="size-4" />
            </SectionScrollLink>
          </Button>
          <Button asChild variant="outline" size="lg">
            <SectionScrollLink href={localizeHref(locale, '/#contact')}>
              {copy.secondaryCta}
            </SectionScrollLink>
          </Button>
        </div>
      </div>

      <Card variant="solid" className="overflow-hidden">
        <CardContent className="p-0">
          <div className="border-b border-border bg-secondary px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {copy.profileSnapshotLabel}
                </p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {copy.profileSnapshotTitle}
                </p>
              </div>
              <Badge variant="success" className="justify-center text-center">
                {copy.profileSnapshotBadge}
              </Badge>
            </div>
          </div>

          <div className="grid gap-4 p-5">
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-sm font-medium text-muted-foreground">
                {copy.profileSummaryLabel}
              </p>
              <p className="mt-3 text-sm leading-7 text-foreground">{copy.profileSummary}</p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {copy.profilePanels.map((panel) => (
                <MiniPanel key={panel.label} label={panel.label} value={panel.value} />
              ))}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {copy.metrics.technologies}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {copy.skillHighlights.slice(0, 8).map((technology) => (
                  <Badge key={technology} variant="outline">
                    {technology}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function MiniPanel({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary p-4">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
