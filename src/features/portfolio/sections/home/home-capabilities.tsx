import { Blocks, PanelsTopLeft, PlugZap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionIntro } from "../../components/section-intro";
import type { PortfolioDictionary } from "../../i18n/types";

interface HomeCapabilitiesProps {
  copy: PortfolioDictionary["home"];
}

const icons = [PanelsTopLeft, Blocks, PlugZap];

export function HomeCapabilities({ copy }: HomeCapabilitiesProps) {
  return (
    <section id="about" className="anchor-target">
      <div className="section-divider" />
      <div className="pt-18 sm:pt-24">
        <SectionIntro
          label={copy.capabilitiesLabel}
          title={copy.capabilitiesTitle}
          description={copy.capabilitiesDescription}
        />
        <div className="stagger-list mt-8 grid gap-5 lg:grid-cols-3">
          {copy.capabilities.map((capability, index) => {
            const Icon = icons[index] ?? Blocks;

            return (
              <Card key={capability.title} variant="interactive">
                <CardContent className="p-6">
                  <div className="flex size-11 items-center justify-center rounded-xl border border-border bg-secondary text-primary">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-foreground">
                    {capability.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {capability.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
