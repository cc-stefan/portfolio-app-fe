import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  label: string;
  title: string;
  description: string;
  className?: string;
}

export function SectionHeading({
  label,
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <p className="text-xs font-medium uppercase tracking-[0.32em] text-foreground/45">
        {label}
      </p>
      <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
        {title}
      </h2>
      <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
        {description}
      </p>
    </div>
  );
}
