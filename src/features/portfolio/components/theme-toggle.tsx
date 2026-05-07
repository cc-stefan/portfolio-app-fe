'use client';

import { useSyncExternalStore } from 'react';
import { MoonStar, SunMedium } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  label: string;
  className?: string;
}

function subscribe() {
  return () => undefined;
}

export function ThemeToggle({ label, className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn(className)}
      aria-label={label}
      aria-pressed={isDark}
      disabled={!mounted}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? <SunMedium className="size-4" /> : <MoonStar className="size-4" />}
    </Button>
  );
}
