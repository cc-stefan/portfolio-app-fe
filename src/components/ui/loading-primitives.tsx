import type { ComponentProps } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface LoadingHeaderProps extends ComponentProps<'div'> {
  eyebrowWidth?: string;
  titleWidth?: string;
  descriptionWidth?: string;
}

export function LoadingHeader({
  className,
  eyebrowWidth = 'w-28',
  titleWidth = 'w-52',
  descriptionWidth = 'w-96',
  ...props
}: LoadingHeaderProps) {
  return (
    <div className={cn('space-y-3', className)} {...props}>
      <Skeleton className={cn('h-3.5 max-w-full rounded-full', eyebrowWidth)} />
      <Skeleton className={cn('h-10 max-w-full rounded-xl', titleWidth)} />
      <Skeleton className={cn('h-5 max-w-full rounded-full', descriptionWidth)} />
    </div>
  );
}

interface LoadingPanelProps extends Omit<ComponentProps<typeof Card>, 'variant'> {
  padded?: boolean;
}

export function LoadingPanel({ className, padded = true, ...props }: LoadingPanelProps) {
  return <Card variant="solid" className={cn(padded && 'p-5 sm:p-6', className)} {...props} />;
}
