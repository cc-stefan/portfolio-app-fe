import { cn } from "@/lib/utils";

interface SectionIntroProps {
  label: string;
  title: string;
  description: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionIntro({
  label,
  title,
  description,
  align = "left",
  className,
}: SectionIntroProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
        {label}
      </p>
      <h2 className="mt-4 text-balance text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
        {description}
      </p>
    </div>
  );
}
