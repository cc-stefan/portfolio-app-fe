export function ProjectCardSkeleton() {
  return (
    <div className="rounded-[2rem] border border-black/10 bg-white/72 p-4">
      <div className="aspect-[16/10] rounded-[1.6rem] bg-black/8" />
      <div className="mt-5 space-y-3">
        <div className="h-8 rounded-full bg-black/8" />
        <div className="h-4 rounded-full bg-black/8" />
        <div className="h-4 w-5/6 rounded-full bg-black/8" />
      </div>
    </div>
  );
}
