import { Gauge, Handshake, Layers3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { SectionIntro } from '../../components/section-intro';
import type { PortfolioDictionary } from '../../i18n/types';

interface HomeCredentialsProps {
  copy: PortfolioDictionary['home'];
}

const icons = [Gauge, Layers3, Handshake];

export function HomeCredentials({ copy }: HomeCredentialsProps) {
  return (
    <section id="skills" className="anchor-target">
      <div className="section-divider" />
      <div className="pt-18 sm:pt-24">
        <SectionIntro
          label={copy.credentialsLabel}
          title={copy.credentialsTitle}
          description={copy.credentialsDescription}
        />
        <div className="stagger-list mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {copy.credentialGroups.map((group, index) => {
            const Icon = icons[index] ?? Layers3;

            return (
              <Card
                key={group.title}
                variant={index === 1 ? 'default' : 'solid'}
                className="h-full min-w-0 overflow-hidden"
              >
                <div
                  className={cn(
                    'h-1',
                    index === 0
                      ? 'bg-primary'
                      : index === 1
                        ? 'bg-[linear-gradient(90deg,var(--primary),var(--accent))]'
                        : 'bg-accent'
                  )}
                />
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg border border-primary/18 bg-primary/8 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="text-lg font-semibold text-foreground">{group.title}</h3>
                  </div>
                  <ul className="mt-5 grid gap-0">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="border-t border-border/75 py-2.5 text-sm leading-6 text-muted-foreground first:border-t-0 first:pt-0"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
