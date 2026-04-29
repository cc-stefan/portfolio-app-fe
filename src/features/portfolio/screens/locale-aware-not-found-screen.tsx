"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StateCard } from "../components/state-card";
import { defaultLocale, isAppLocale, type AppLocale } from "../i18n/routing";
import type { PortfolioDictionary } from "../i18n/types";

interface LocaleAwareNotFoundScreenProps {
  dictionaries: Record<AppLocale, PortfolioDictionary>;
}

export function LocaleAwareNotFoundScreen({
  dictionaries,
}: LocaleAwareNotFoundScreenProps) {
  const pathname = usePathname();
  const localeSegment = pathname.split("/")[1] ?? defaultLocale;
  const locale = isAppLocale(localeSegment) ? localeSegment : defaultLocale;
  const dictionary = dictionaries[locale];

  return (
    <div className="container-page flex min-h-[70vh] items-center py-16">
      <StateCard
        eyebrow="404"
        title={dictionary.meta.notFoundTitle}
        description={dictionary.meta.notFoundDescription}
        action={
          <Button asChild size="lg">
            <Link href={`/${locale}`}>{dictionary.actions.browseProjects}</Link>
          </Button>
        }
      />
    </div>
  );
}
