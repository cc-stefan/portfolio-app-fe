import { ArrowRight, Layers3 } from "lucide-react";
import { GlassPanel } from "../../components/glass-panel";

interface ProjectOverviewSectionProps {
  paragraphs: string[];
}

const deliveryNotes = [
  {
    title: "Server-rendered route",
    description:
      "Next.js fetches the project server-side, so route transitions never depend on duplicating project JSON in the frontend.",
    icon: Layers3,
  },
  {
    title: "Backend-driven content",
    description:
      "Updating a project in the Nest admin API changes what this page presents without a code edit in the frontend.",
    icon: ArrowRight,
  },
];

export function ProjectOverviewSection({
  paragraphs,
}: ProjectOverviewSectionProps) {
  return (
    <section className="grid gap-8 pt-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <GlassPanel
        as="article"
        className="rounded-[2.25rem] p-8 sm:p-10"
      >
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-foreground/45">
          Overview
        </p>
        <div className="mt-6 space-y-6 text-base leading-8 text-foreground/82 sm:text-lg">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </GlassPanel>

      <GlassPanel
        as="aside"
        className="rounded-[2rem] p-6"
      >
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-foreground/45">
          Delivery notes
        </p>
        <div className="mt-6 space-y-4">
          {deliveryNotes.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="rounded-[1.5rem] border border-black/10 bg-white/70 p-4"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Icon className="size-4" />
                {title}
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </GlassPanel>
    </section>
  );
}
