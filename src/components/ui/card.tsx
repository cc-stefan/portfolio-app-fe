import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  'flex flex-col rounded-xl text-card-foreground transition-[transform,box-shadow,border-color,background-color] duration-300',
  {
    variants: {
      variant: {
        default: 'surface-card',
        solid: 'surface-solid',
        muted: 'surface-muted shadow-none',
        ghost: 'border border-transparent bg-transparent shadow-none',
        interactive: 'surface-card premium-lift',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface CardProps extends React.ComponentProps<'div'>, VariantProps<typeof cardVariants> {}

function Card({ className, variant, ...props }: CardProps) {
  return <div data-slot="card" className={cn(cardVariants({ variant, className }))} {...props} />;
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn('flex flex-col gap-2 p-5 pb-0 sm:p-6 sm:pb-0', className)}
      {...props}
    />
  );
}

interface CardTitleProps extends React.ComponentProps<'div'> {
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'h4';
}

function CardTitle({ as: Component = 'div', className, ...props }: CardTitleProps) {
  return (
    <Component
      data-slot="card-title"
      className={cn('text-xl font-semibold text-foreground', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-sm leading-7 text-muted-foreground', className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('p-5 sm:p-6', className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center p-5 pt-0 sm:p-6 sm:pt-0', className)}
      {...props}
    />
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants };
