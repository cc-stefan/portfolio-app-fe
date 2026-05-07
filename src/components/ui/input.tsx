import * as React from 'react';
import { cn } from '@/lib/utils';

export function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      data-slot="input"
      type={type}
      className={cn(
        [
          'flex h-11 w-full rounded-lg border border-border bg-input px-3.5 text-sm text-foreground shadow-sm',
          'transition-[border-color,box-shadow,background-color] duration-200 outline-none',
          'placeholder:text-muted-foreground/75 hover:border-foreground/20',
          'focus-visible:border-primary/55 focus-visible:ring-4 focus-visible:ring-ring/45',
          'disabled:cursor-not-allowed disabled:opacity-60',
          'aria-invalid:border-destructive/70 aria-invalid:ring-4 aria-invalid:ring-destructive/15',
        ],
        className
      )}
      {...props}
    />
  );
}
