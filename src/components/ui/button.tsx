import * as React from 'react';
import { Slot } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'inline-flex min-w-0 max-w-full items-center justify-center gap-2 whitespace-normal rounded-lg text-center text-sm font-medium sm:whitespace-nowrap',
    'transition-[transform,background-color,border-color,color,box-shadow,opacity] duration-200',
    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/45',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary:
          'border border-primary/20 bg-primary text-primary-foreground shadow-[var(--primary-shadow)] hover:-translate-y-0.5 hover:bg-primary/92 hover:shadow-[var(--primary-shadow-hover)] active:translate-y-0',
        secondary:
          'border border-border bg-secondary text-secondary-foreground shadow-sm hover:-translate-y-0.5 hover:border-primary/24 hover:bg-muted active:translate-y-0',
        outline:
          'border border-border bg-card/88 text-foreground shadow-sm hover:-translate-y-0.5 hover:border-primary/24 hover:bg-secondary active:translate-y-0',
        ghost:
          'border border-transparent text-muted-foreground hover:bg-secondary/80 hover:text-foreground',
        destructive:
          'bg-destructive text-white shadow-sm hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0',
      },
      size: {
        sm: 'h-9 px-3.5 text-xs',
        md: 'h-10 px-4',
        lg: 'h-12 px-5 text-[0.95rem]',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { buttonVariants };
