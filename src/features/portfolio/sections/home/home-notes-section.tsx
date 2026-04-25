import type { HomeSystemNote } from "../../content/home-content";
import { GlassPanel } from "../../components/glass-panel";

interface HomeNotesSectionProps {
  notes: HomeSystemNote[];
}

export function HomeNotesSection({ notes }: HomeNotesSectionProps) {
  return (
    <section className="grid gap-6 rounded-[2.5rem] border border-black/10 bg-white/72 p-8 shadow-[0_24px_90px_-52px_rgba(15,23,42,0.32)] backdrop-blur-sm lg:grid-cols-3">
      {notes.map(({ title, description, icon: Icon }) => (
        <GlassPanel
          key={title}
          as="article"
          className="rounded-[1.75rem] border-black/8 bg-white/70 p-6 shadow-none"
        >
          <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_16px_40px_-24px_rgba(15,23,42,0.65)]">
            <Icon className="size-5" />
          </div>
          <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-foreground">
            {title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {description}
          </p>
        </GlassPanel>
      ))}
    </section>
  );
}
