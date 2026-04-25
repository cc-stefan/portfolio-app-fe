import { PortfolioHeaderSkeleton } from "../components/portfolio-header-skeleton";
import { PortfolioPageShell } from "../components/portfolio-page-shell";

export function PortfolioProjectLoadingScreen() {
  return (
    <PortfolioPageShell>
      <div className="animate-pulse">
        <PortfolioHeaderSkeleton />

        <section className="grid gap-10 pb-10 pt-16 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-4">
            <div className="h-4 w-36 rounded-full bg-black/8" />
            <div className="h-16 rounded-[2rem] bg-black/8" />
            <div className="h-16 w-5/6 rounded-[2rem] bg-black/8" />
            <div className="h-5 rounded-full bg-black/8" />
            <div className="h-5 w-4/5 rounded-full bg-black/8" />
          </div>
          <div className="rounded-[2rem] border border-black/10 bg-white/72 p-6">
            <div className="space-y-4">
              <div className="h-6 w-28 rounded-full bg-black/8" />
              <div className="h-14 rounded-[1.5rem] bg-black/8" />
              <div className="h-14 rounded-[1.5rem] bg-black/8" />
              <div className="h-14 rounded-[1.5rem] bg-black/8" />
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="aspect-[16/10] rounded-[2.25rem] bg-black/8" />
          <div className="rounded-[2rem] border border-black/10 bg-white/72 p-6">
            <div className="space-y-4">
              <div className="h-6 w-28 rounded-full bg-black/8" />
              <div className="h-12 rounded-[1.5rem] bg-black/8" />
              <div className="h-12 rounded-[1.5rem] bg-black/8" />
              <div className="h-12 rounded-[1.5rem] bg-black/8" />
            </div>
          </div>
        </section>
      </div>
    </PortfolioPageShell>
  );
}
