import { ArrowUpRight, CheckCircle2, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { InquiryForm } from "../../forms/inquiry-form";
import { SectionIntro } from "../../components/section-intro";
import type { AppLocale } from "../../i18n/routing";
import type { PortfolioDictionary } from "../../i18n/types";

interface HomeInquiryProps {
  locale: AppLocale;
  dictionary: PortfolioDictionary;
}

export function HomeInquiry({ locale, dictionary }: HomeInquiryProps) {
  return (
    <section id="contact" className="anchor-target">
      <div className="section-divider" />
      <div className="pt-18 sm:pt-24">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <SectionIntro
              label={dictionary.home.inquiryLabel}
              title={dictionary.home.inquiryTitle}
              description={dictionary.home.inquiryDescription}
            />
            <Card variant="muted" className="mt-8">
              <CardContent className="grid gap-4 p-5">
                {dictionary.home.inquiryHighlights.map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {item.title}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-primary/12 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/45"
                        >
                          <Mail className="size-3.5 shrink-0 text-primary" />
                          <span className="break-all">
                            {item.description}
                          </span>
                          <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground" />
                        </a>
                      ) : (
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card variant="solid">
            <CardContent className="p-5 sm:p-6 lg:p-8">
              <InquiryForm locale={locale} copy={dictionary.inquiryForm} />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
