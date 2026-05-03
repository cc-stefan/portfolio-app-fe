import { Gauge, Handshake, Layers3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionIntro } from "../../components/section-intro";
import type { PortfolioDictionary } from "../../i18n/types";

interface HomeCredentialsProps {
  copy: PortfolioDictionary["home"];
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
        <div className="stagger-list mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {copy.credentialGroups.map((group, index) => {
            const Icon = icons[index] ?? Layers3;

            return (
              <Card key={group.title} variant="solid" className="h-full">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl border border-border bg-secondary text-primary">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="text-lg font-semibold text-foreground">
                      {group.title}
                    </h3>
                  </div>
                  <ul className="mt-5 grid gap-3">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="text-sm leading-6 text-muted-foreground"
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
