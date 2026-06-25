import { LoadingHeader, LoadingPanel } from '@/components/ui/loading-primitives';
import { Skeleton } from '@/components/ui/skeleton';
import {
  PortfolioLoadingMetricGrid,
  PortfolioLoadingShell,
} from '../components/portfolio-loading-shell';

export function PortfolioHomeLoadingScreen() {
  return (
    <PortfolioLoadingShell>
      <div className="page-enter grid gap-10 lg:grid-cols-[minmax(0,1.04fr)_minmax(22rem,0.96fr)] lg:items-center">
        <div className="space-y-6">
          <LoadingHeader
            eyebrowWidth="w-32"
            titleWidth="w-full max-w-3xl"
            descriptionWidth="w-4/5"
          />
          <div className="space-y-3">
            <Skeleton className="h-6 w-5/6 rounded-full" />
            <Skeleton className="h-6 w-2/3 rounded-full" />
          </div>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Skeleton className="h-12 w-40 rounded-lg" />
            <Skeleton className="h-12 w-36 rounded-lg" />
          </div>
        </div>
        <LoadingPanel padded={false} className="overflow-hidden">
          <div className="h-1 w-full bg-[linear-gradient(90deg,var(--primary),color-mix(in_oklch,var(--accent)_82%,var(--primary)))]" />
          <div className="border-b border-border bg-card/82 px-5 py-4">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-24 rounded-full" />
                <Skeleton className="h-6 w-40 rounded-xl" />
              </div>
              <Skeleton className="h-8 w-28 rounded-full" />
            </div>
          </div>
          <div className="grid gap-4 p-5">
            <Skeleton className="h-28 w-full rounded-lg" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </LoadingPanel>
      </div>

      <div className="page-enter pt-18 sm:pt-24">
        <PortfolioLoadingMetricGrid />
      </div>
    </PortfolioLoadingShell>
  );
}
