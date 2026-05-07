import { Skeleton } from '@/components/ui/skeleton';

export function PortfolioHomeLoadingScreen() {
  return (
    <main className="container-page grid min-h-screen gap-8 py-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)] lg:items-center">
      <div className="space-y-5">
        <Skeleton className="h-7 w-40 rounded-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-5/6" />
        <Skeleton className="h-6 w-4/5 rounded-full" />
        <Skeleton className="h-6 w-2/3 rounded-full" />
        <div className="flex gap-3 pt-4">
          <Skeleton className="h-12 w-36" />
          <Skeleton className="h-12 w-36" />
        </div>
      </div>
      <Skeleton className="h-[28rem]" />
    </main>
  );
}
