import { SkeletonBlock } from "./skeleton-block";

export function PortfolioHeaderSkeleton() {
  return (
    <header className="flex flex-col gap-4 rounded-full border border-black/10 bg-white/65 px-5 py-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
      <SkeletonBlock className="h-9 w-44" />
      <SkeletonBlock className="h-9 w-36" />
    </header>
  );
}
