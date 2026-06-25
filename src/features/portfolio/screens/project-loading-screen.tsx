import { LoadingPanel } from '@/components/ui/loading-primitives';
import { Skeleton } from '@/components/ui/skeleton';
import { PortfolioLoadingShell } from '../components/portfolio-loading-shell';

export function PortfolioProjectLoadingScreen() {
  return (
    <PortfolioLoadingShell>
      <div className="space-y-16">
        <section className="page-enter grid gap-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <Skeleton className="h-10 w-40 rounded-lg" />
            <Skeleton className="h-8 w-28 rounded-full" />
          </div>

          <div className="max-w-4xl space-y-4">
            <Skeleton className="h-3.5 w-24 rounded-full" />
            <Skeleton className="h-14 w-full rounded-2xl" />
            <Skeleton className="h-14 w-4/5 rounded-2xl" />
          </div>

          <LoadingPanel padded={false} className="overflow-hidden">
            <Skeleton className="aspect-[16/9] w-full rounded-none" />
          </LoadingPanel>
        </section>

        <section className="page-enter grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_22rem]">
          <LoadingPanel>
            <div className="space-y-5">
              <Skeleton className="h-6 w-40 rounded-xl" />
              <Skeleton className="h-4 w-3/4 rounded-full" />
              <Skeleton className="h-40 w-full rounded-2xl" />
              <Skeleton className="h-28 w-full rounded-2xl" />
            </div>
          </LoadingPanel>

          <LoadingPanel>
            <div className="space-y-4">
              <Skeleton className="h-6 w-28 rounded-xl" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full rounded-xl" />
                ))}
              </div>
            </div>
          </LoadingPanel>
        </section>

        <section className="page-enter space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-6 w-40 rounded-xl" />
            <Skeleton className="h-4 w-3/4 rounded-full" />
          </div>
          <div className="stagger-list grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <LoadingPanel key={index} padded={false} className="overflow-hidden">
                <Skeleton className="aspect-[16/10] w-full rounded-none" />
                <div className="space-y-4 p-5">
                  <Skeleton className="h-6 w-3/4 rounded-xl" />
                  <Skeleton className="h-14 w-full rounded-2xl" />
                  <div className="flex gap-2">
                    <Skeleton className="h-7 w-16 rounded-full" />
                    <Skeleton className="h-7 w-20 rounded-full" />
                  </div>
                </div>
              </LoadingPanel>
            ))}
          </div>
        </section>
      </div>
    </PortfolioLoadingShell>
  );
}
