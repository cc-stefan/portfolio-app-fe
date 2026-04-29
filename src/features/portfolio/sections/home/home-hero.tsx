import Link from "next/link";
import { ArrowRight, DatabaseZap, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AppLocale } from "../../i18n/routing";
import { localizeHref } from "../../i18n/routing";
import type { PortfolioDictionary } from "../../i18n/types";
import type { PortfolioProject } from "../../model/types";

interface HomeHeroProps {
  locale: AppLocale;
  copy: PortfolioDictionary["home"];
  latestProject: PortfolioProject | null;
  technologies: string[];
  apiBaseUrl: string;
}

export function HomeHero({
  locale,
  copy,
  latestProject,
  technologies,
  apiBaseUrl,
}: HomeHeroProps) {
  return (
    <section
      id="overview"
      className="anchor-target grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)] lg:items-center"
    >
      <div>
        <Badge variant="accent">{copy.eyebrow}</Badge>
        <h1 className="mt-6 max-w-5xl text-balance text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
          {copy.title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
          {copy.description}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href={localizeHref(locale, "/#work")}>
              {copy.primaryCta}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href={localizeHref(locale, "/#contact")}>
              {copy.secondaryCta}
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
          <SignalItem icon={<ShieldCheck className="size-4" />}>
            {copy.availability}
          </SignalItem>
          <SignalItem icon={<DatabaseZap className="size-4" />}>
            {apiBaseUrl}
          </SignalItem>
        </div>
      </div>

      <Card variant="solid" className="overflow-hidden">
        <CardContent className="p-0">
          <div className="border-b border-border bg-secondary px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Product snapshot
                </p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {latestProject?.title ?? "Live portfolio system"}
                </p>
              </div>
              <Badge variant="success">Ready</Badge>
            </div>
          </div>

          <div className="grid gap-4 p-5">
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-sm font-medium text-muted-foreground">
                Current narrative
              </p>
              <p className="mt-3 text-sm leading-7 text-foreground">
                {latestProject?.summary ?? copy.showcaseDescription}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <MiniPanel label={copy.metrics.projects} value="API-driven" />
              <MiniPanel label={copy.metrics.status} value="State-aware" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Stack signals
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {technologies.length > 0 ? (
                  technologies.slice(0, 6).map((technology) => (
                    <Badge key={technology} variant="outline">
                      {technology}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="outline">Next.js</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function SignalItem({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-secondary p-3">
      <span className="mt-0.5 text-primary">{icon}</span>
      <span className="line-clamp-3 leading-6">{children}</span>
    </div>
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
