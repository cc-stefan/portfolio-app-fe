import { Blocks, PanelsTopLeft, PlugZap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { SectionIntro } from '../../components/section-intro';
import type { PortfolioDictionary } from '../../i18n/types';

interface HomeCapabilitiesProps {
  copy: PortfolioDictionary['home'];
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
        <div className="stagger-list mt-9 grid gap-5 lg:grid-cols-12">
          {copy.capabilities.map((capability, index) => {
            const Icon = icons[index] ?? Blocks;

            return (
              <Card
                key={capability.title}
                variant="interactive"
                className="capability-card lg:col-span-4"
              >
                <CardContent className="relative z-10 flex h-full flex-col p-5 sm:p-6">
                  <div className="flex size-11 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary shadow-sm">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-auto pt-10 text-xl font-semibold tracking-[-0.03em] text-foreground">
                    {capability.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
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
