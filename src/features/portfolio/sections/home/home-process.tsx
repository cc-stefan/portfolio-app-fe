import { Card, CardContent } from "@/components/ui/card";
import { SectionIntro } from "../../components/section-intro";
import type { PortfolioDictionary } from "../../i18n/types";

interface HomeProcessProps {
  copy: PortfolioDictionary["home"];
}

export function HomeProcess({ copy }: HomeProcessProps) {
  return (
    <section>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
        <SectionIntro
          label={copy.processLabel}
          title={copy.processTitle}
          description={copy.processDescription}
          className="lg:sticky lg:top-28"
        />
        <div className="stagger-list grid gap-4">
          {copy.processCards.map((card, index) => (
            <Card key={card.title} variant="solid" className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid gap-0 sm:grid-cols-[8rem_minmax(0,1fr)]">
                  <div className="border-b border-border bg-secondary p-5 sm:border-b-0 sm:border-r">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      Step
                    </p>
                    <p className="mt-3 text-3xl font-semibold text-foreground">
                      0{index + 1}
                    </p>
                  </div>
                  <div className="p-5 sm:p-6">
                    <h3 className="text-xl font-semibold text-foreground">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {card.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
