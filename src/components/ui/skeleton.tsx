import * as React from 'react';
import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "relative overflow-hidden rounded-lg border border-border/70 bg-[linear-gradient(135deg,color-mix(in_oklch,var(--surface-muted)_82%,transparent),color-mix(in_oklch,var(--card)_88%,transparent))] before:absolute before:inset-y-0 before:left-[-45%] before:w-[40%] before:animate-[skeleton-shimmer_1.8s_ease-in-out_infinite] before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] before:content-[''] dark:before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)]",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
