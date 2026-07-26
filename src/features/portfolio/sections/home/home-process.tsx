import { Card, CardContent } from '@/components/ui/card';
import { SectionIntro } from '../../components/section-intro';
import type { PortfolioDictionary } from '../../i18n/types';

interface HomeProcessProps {
  copy: PortfolioDictionary['home'];
}

export function HomeProcess({ copy }: HomeProcessProps) {
  return (
    <section id="process" className="anchor-target">
      <div className="section-divider" />
      <div className="pt-18 sm:pt-24">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <SectionIntro
            label={copy.processLabel}
            title={copy.processTitle}
            description={copy.processDescription}
            className="lg:sticky lg:top-28"
          />
          <div className="process-timeline stagger-list grid gap-3">
            {copy.processCards.map((card, index) => (
              <div key={card.title} className="process-step">
                <span className="process-step-index" aria-hidden="true">
                  {index + 1}
                </span>
                <Card variant="solid" className="overflow-hidden">
                  <CardContent className="p-5">
                    <p className="hero-index text-primary">{copy.processStepLabel}</p>
                    <h3 className="mt-2.5 text-lg font-semibold tracking-[-0.02em] text-foreground">
                      {card.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-6 text-muted-foreground">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
