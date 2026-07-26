import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { AppLocale } from '../../i18n/routing';
import { localeTags, localizeHref } from '../../i18n/routing';
import type { PortfolioDictionary } from '../../i18n/types';
import type { PortfolioAvailability } from '../../model/types';
import { SectionScrollLink } from '../../components/section-scroll-link';

interface HomeHeroProps {
  locale: AppLocale;
  copy: PortfolioDictionary['home'];
  availability: PortfolioAvailability;
}

export function HomeHero({ locale, copy, availability }: HomeHeroProps) {
  const isAvailable = availability.availableForCollaboration;
  const availableFrom = formatAvailabilityDate(availability.availableFrom, locale);
  const availabilityMessage = copy.profileSnapshotReachOutFrom.split('{date}');

  return (
    <section
      id="home"
      className="hero-stage anchor-target grid gap-8 px-4 sm:px-7 lg:grid-cols-[minmax(0,1.04fr)_minmax(23rem,0.96fr)] lg:items-center lg:gap-10 lg:px-10"
    >
      <div className="relative z-10">
        <p className="section-kicker">{copy.profileSnapshotLabel}</p>
        <h1 className="display-title mt-5 text-foreground">{copy.title}</h1>
        <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
          {copy.description}
        </p>

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

      <div className="hero-console">
        <div className="hero-console-rail" />
        <div className="relative">
          <div className="border-b border-border/80 px-5 py-4 sm:px-6">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-lg font-semibold tracking-[-0.025em] text-foreground">
                {copy.profileSnapshotTitle}
              </p>
              <div className="max-w-full sm:text-right" aria-live="polite">
                <Badge
                  variant={isAvailable ? 'success' : 'warning'}
                  className="hero-availability-badge justify-center px-3.5 py-1.5 text-center font-semibold tracking-[0.16em]"
                >
                  <span className="hero-availability-dot" aria-hidden="true" />
                  <span className="min-w-0">
                    {isAvailable ? copy.profileSnapshotBadge : copy.profileSnapshotUnavailableBadge}
                  </span>
                </Badge>
                {!isAvailable && availableFrom ? (
                  <p className="mt-2 max-w-xs text-xs leading-5 text-muted-foreground sm:ml-auto">
                    {availabilityMessage[0]}
                    <span className="whitespace-nowrap">{availableFrom}</span>
                    {availabilityMessage[1]}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-5 sm:p-6">
            <div className="rounded-lg border border-border/80 bg-secondary/58 p-4 sm:p-5">
              <p className="hero-index">{copy.profileSummaryLabel}</p>
              <p className="mt-3 text-sm leading-7 text-foreground/92">{copy.profileSummary}</p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {copy.profilePanels.map((panel) => (
                <MiniPanel key={panel.label} label={panel.label} value={panel.value} />
              ))}
            </div>

            <div>
              <p className="hero-index">{copy.metrics.technologies}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {copy.skillHighlights.map((technology) => (
                  <Badge key={technology} variant="outline">
                    {technology}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatAvailabilityDate(value: string | null, locale: AppLocale) {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat(localeTags[locale], {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

function MiniPanel({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/80 bg-card/62 p-4 shadow-sm">
      <p className="hero-index">{label}</p>
      <p className="mt-3 text-sm font-semibold leading-6 text-foreground">{value}</p>
    </div>
  );
}
