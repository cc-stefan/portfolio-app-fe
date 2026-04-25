import { cn } from "@/lib/utils";

interface TechnologyCloudProps {
  technologies: string[];
  limit?: number;
  size?: "sm" | "md";
  className?: string;
  emptyLabel?: string;
}

export function TechnologyCloud({
  technologies,
  limit,
  size = "md",
  className,
  emptyLabel = "No tags yet",
}: TechnologyCloudProps) {
  const visibleTechnologies = limit ? technologies.slice(0, limit) : technologies;
  const remainingTechnologiesCount = limit
    ? Math.max(technologies.length - visibleTechnologies.length, 0)
    : 0;
  const pillClasses =
    size === "sm"
      ? "px-3 py-1 text-[11px] uppercase tracking-[0.18em]"
      : "px-3 py-2 text-xs uppercase tracking-[0.24em]";

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {visibleTechnologies.length > 0 ? (
        <>
          {visibleTechnologies.map((technology) => (
            <span
              key={technology}
              className={cn(
                "rounded-full border border-black/10 bg-black/4 text-foreground/70",
                pillClasses,
              )}
            >
              {technology}
            </span>
          ))}
          {remainingTechnologiesCount > 0 ? (
            <span
              className={cn(
                "rounded-full border border-black/10 bg-black/4 text-foreground/45",
                pillClasses,
              )}
            >
              +{remainingTechnologiesCount}
            </span>
          ) : null}
        </>
      ) : (
        <span
          className={cn(
            "rounded-full border border-dashed border-black/10 text-foreground/45",
            pillClasses,
          )}
        >
          {emptyLabel}
        </span>
      )}
    </div>
  );
}
