"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  appLocales,
  replaceLocaleInPathname,
  type AppLocale,
} from "../i18n/routing";
import type { PortfolioDictionary } from "../i18n/types";

interface LocaleSwitcherProps {
  locale: AppLocale;
  localeNames: PortfolioDictionary["localeNames"];
  label: string;
  className?: string;
}

export function LocaleSwitcher({
  locale,
  localeNames,
  label,
  className,
}: LocaleSwitcherProps) {
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn("min-w-0", className)}
        >
          <Languages className="size-4" />
          <span className="truncate">{localeNames[locale]}</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        {appLocales.map((entry) => (
          <DropdownMenuItem key={entry} asChild>
            <Link
              href={replaceLocaleInPathname(pathname, entry)}
              className={cn(entry === locale && "bg-secondary text-foreground")}
            >
              <span className="min-w-8 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {entry}
              </span>
              <span>{localeNames[entry]}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
