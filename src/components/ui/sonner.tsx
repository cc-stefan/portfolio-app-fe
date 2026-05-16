'use client';

import type { CSSProperties } from 'react';
import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { CircleCheckBig, Info, LoaderCircle, OctagonAlert, TriangleAlert } from 'lucide-react';

function subscribe() {
  return () => undefined;
}

const safeAreaToastOffset = {
  top: 'calc(var(--safe-area-inset-top) + 0.75rem)',
  right: 'calc(var(--safe-area-inset-right) + 0.75rem)',
  bottom: 'calc(var(--safe-area-inset-bottom) + 0.75rem)',
  left: 'calc(var(--safe-area-inset-left) + 0.75rem)',
} as const;

export function Toaster(props: ToasterProps) {
  const { theme = 'system' } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  return (
    <Sonner
      theme={(mounted ? theme : 'light') as ToasterProps['theme']}
      offset={safeAreaToastOffset}
      mobileOffset={safeAreaToastOffset}
      icons={{
        success: <CircleCheckBig className="size-4" />,
        info: <Info className="size-4" />,
        warning: <TriangleAlert className="size-4" />,
        error: <OctagonAlert className="size-4" />,
        loading: <LoaderCircle className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            'rounded-xl border border-border bg-popover text-popover-foreground shadow-[var(--surface-shadow-lg)]',
          title: 'text-sm font-semibold',
          description: 'text-sm',
          actionButton: 'rounded-lg bg-primary px-4 text-primary-foreground hover:brightness-105',
          cancelButton: 'rounded-lg border border-border bg-secondary px-4 text-foreground',
        },
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as CSSProperties
      }
      {...props}
    />
  );
}
