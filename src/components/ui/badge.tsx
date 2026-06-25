import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex min-w-0 max-w-full items-center gap-2 rounded-full border px-2.5 py-1 text-center text-[11px] font-semibold leading-5 uppercase tracking-[0.12em] [overflow-wrap:anywhere]',
  {
    variants: {
      variant: {
        neutral: 'border-border bg-secondary/80 text-muted-foreground',
        accent:
          'border-primary/24 bg-primary/10 text-primary dark:border-primary/34 dark:bg-primary/16',
        success: 'border-emerald-500/22 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
        warning: 'border-amber-500/24 bg-amber-500/10 text-amber-700 dark:text-amber-300',
        outline: 'border-border bg-card/72 text-muted-foreground',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div data-slot="badge" className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { badgeVariants };
