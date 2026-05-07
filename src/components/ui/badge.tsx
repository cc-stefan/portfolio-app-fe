import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em]',
  {
    variants: {
      variant: {
        neutral: 'border-border bg-secondary text-muted-foreground',
        accent:
          'border-primary/20 bg-primary/10 text-primary dark:border-primary/30 dark:bg-primary/15',
        success: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
        warning: 'border-amber-500/24 bg-amber-500/10 text-amber-700 dark:text-amber-300',
        outline: 'border-border bg-transparent text-muted-foreground',
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
