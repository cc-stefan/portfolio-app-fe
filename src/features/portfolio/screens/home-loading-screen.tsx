import { PortfolioHeaderSkeleton } from "../components/portfolio-header-skeleton";
import { PortfolioPageShell } from "../components/portfolio-page-shell";
import { ProjectCardSkeleton } from "../components/project-card-skeleton";
import { SkeletonBlock } from "../components/skeleton-block";

export function PortfolioHomeLoadingScreen() {
  return (
    <PortfolioPageShell>
      <div className="animate-pulse">
        <PortfolioHeaderSkeleton />

        <section className="grid gap-12 pb-20 pt-16 lg:grid-cols-[minmax(0,1.1fr)_24rem]">
          <div className="space-y-5">
            <SkeletonBlock className="h-4 w-40" />
            <div className="space-y-3">
              <div className="h-16 rounded-[2rem] bg-black/8" />
              <div className="h-16 rounded-[2rem] bg-black/8" />
              <div className="h-16 w-3/4 rounded-[2rem] bg-black/8" />
            </div>
            <div className="space-y-3">
              <div className="h-5 rounded-full bg-black/8" />
              <div className="h-5 rounded-full bg-black/8" />
              <div className="h-5 w-5/6 rounded-full bg-black/8" />
            </div>
            <div className="flex gap-3">
              <SkeletonBlock className="h-11 w-40" />
              <SkeletonBlock className="h-11 w-40" />
            </div>
          </div>

          <div className="rounded-[2.25rem] border border-black/10 bg-white/72 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-28 rounded-[1.5rem] bg-black/8" />
              <div className="h-28 rounded-[1.5rem] bg-black/8" />
              <div className="h-28 rounded-[1.5rem] bg-black/8" />
              <div className="h-28 rounded-[1.5rem] bg-black/8" />
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
        </section>
      </div>
    </PortfolioPageShell>
  );
}
