import type { ReactNode } from 'react';
import { LoadingPanel } from '@/components/ui/loading-primitives';
import { Skeleton } from '@/components/ui/skeleton';

interface PortfolioLoadingShellProps {
  children: ReactNode;
}

export function PortfolioLoadingShell({ children }: PortfolioLoadingShellProps) {
  return (
    <div className="page-shell">
      <div
        className="pointer-events-none fixed inset-x-0 z-40"
        style={{ top: 'calc(var(--safe-area-inset-top) + var(--header-offset))' }}
      >
        <div className="container-page">
          <header className="pointer-events-auto page-enter surface-card rounded-lg px-3 py-2.5 shadow-[var(--surface-shadow-lg)] sm:px-4">
            <div className="flex items-center gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Skeleton className="size-10 rounded-lg" />
                <div className="min-w-0 space-y-2">
                  <Skeleton className="h-4 w-28 rounded-full" />
                  <Skeleton className="h-3 w-36 max-w-[44vw] rounded-full sm:w-44" />
                </div>
              </div>

              <div className="ml-4 hidden items-center gap-2 lg:flex">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-9 w-[5.5rem] rounded-lg" />
                ))}
              </div>

              <div className="ml-auto hidden items-center gap-2 lg:flex">
                <Skeleton className="h-9 w-28 rounded-lg" />
                <Skeleton className="h-9 w-28 rounded-lg" />
                <Skeleton className="h-9 w-24 rounded-lg" />
                <Skeleton className="size-9 rounded-lg" />
              </div>

              <div className="ml-auto flex items-center gap-2 lg:hidden">
                <Skeleton className="size-9 rounded-lg" />
              </div>
            </div>
          </header>
        </div>
      </div>

      <div className="container-page flex min-h-[100svh] flex-col pb-[calc(1rem_+_var(--safe-area-inset-bottom))] pt-4 sm:pb-[calc(1.5rem_+_var(--safe-area-inset-bottom))] sm:pt-6">
        <div className="safe-content-frame flex flex-1 flex-col">
          <main className="min-w-0 flex-1 pb-4 pt-[var(--main-content-offset)] sm:pb-6">
            {children}
          </main>

          <footer className="mt-10 border-t border-border/80 pt-5">
            <Skeleton className="h-4 w-56 max-w-full rounded-full" />
          </footer>
        </div>
      </div>
    </div>
  );
}

export function PortfolioLoadingMetricGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <LoadingPanel key={index} className="space-y-5">
          <Skeleton className="h-3.5 w-20 rounded-full" />
          <Skeleton className="h-10 w-[4.5rem] rounded-xl" />
        </LoadingPanel>
      ))}
    </div>
  );
}
