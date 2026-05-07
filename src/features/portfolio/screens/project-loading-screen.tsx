import { Skeleton } from '@/components/ui/skeleton';

export function PortfolioProjectLoadingScreen() {
  return (
    <main className="container-page grid min-h-screen gap-8 py-8 lg:grid-cols-[minmax(0,1.08fr)_22rem]">
      <div className="space-y-6">
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-7 w-40 rounded-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-4/5" />
        <Skeleton className="h-6 w-3/4 rounded-full" />
        <Skeleton className="h-[26rem]" />
      </div>
      <Skeleton className="h-80" />
    </main>
  );
}
