'use client';

import { ChevronDown, Languages } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { appLocales, type AppLocale } from '../i18n/routing';
import type { PortfolioDictionary } from '../i18n/types';

interface LocaleSwitcherProps {
  locale: AppLocale;
  localeNames: PortfolioDictionary['localeNames'];
  label: string;
  className?: string;
}

export function LocaleSwitcher({ locale, localeNames, label, className }: LocaleSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleLocaleChange(nextLocale: AppLocale) {
    if (nextLocale === locale) {
      return;
    }

    const search = searchParams.toString();
    const currentHref = `${pathname}${search ? `?${search}` : ''}${window.location.hash}`;

    router.replace(currentHref, { locale: nextLocale });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" size="sm" className={cn('min-w-0', className)}>
          <Languages className="size-4" />
          <span className="truncate">{localeNames[locale]}</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        {appLocales.map((entry) => (
          <DropdownMenuItem
            key={entry}
            className={cn(entry === locale && 'bg-secondary text-foreground')}
            onSelect={() => handleLocaleChange(entry)}
          >
            <span className="min-w-8 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {entry}
            </span>
            <span>{localeNames[entry]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
