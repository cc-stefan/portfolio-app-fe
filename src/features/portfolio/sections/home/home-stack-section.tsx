import { GlassPanel } from "../../components/glass-panel";
import { TechnologyCloud } from "../../components/technology-cloud";

interface HomeStackSectionProps {
  technologies: string[];
}

export function HomeStackSection({ technologies }: HomeStackSectionProps) {
  if (technologies.length === 0) {
    return null;
  }

  return (
    <section id="stack" className="pb-20">
      <GlassPanel className="rounded-[2.25rem] p-6 shadow-[0_24px_90px_-52px_rgba(15,23,42,0.32)]">
        <TechnologyCloud technologies={technologies} />
      </GlassPanel>
    </section>
  );
}
