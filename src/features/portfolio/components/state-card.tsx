import type { ReactNode } from 'react';
import { CircleAlert } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface StateCardProps {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
  tone?: 'neutral' | 'warning' | 'success';
}

export function StateCard({
  eyebrow,
  title,
  description,
  action,
  tone = 'neutral',
}: StateCardProps) {
  const iconClass =
    tone === 'success'
      ? 'text-emerald-600 dark:text-emerald-300'
      : tone === 'warning'
        ? 'text-amber-700 dark:text-amber-300'
        : 'text-primary';

  return (
    <Card variant="solid" className="overflow-hidden">
      <CardHeader className="p-6 pb-0 sm:p-8 sm:pb-0">
        <div className="flex size-11 items-center justify-center rounded-xl border border-border bg-secondary">
          <CircleAlert className={`size-5 ${iconClass}`} />
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          {eyebrow}
        </p>
        <CardTitle className="mt-2 max-w-2xl text-balance text-3xl sm:text-4xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pb-0 sm:p-8 sm:pb-0">
        <CardDescription className="max-w-2xl text-base leading-8">{description}</CardDescription>
      </CardContent>
      {action ? <CardFooter className="p-6 pt-8 sm:p-8 sm:pt-8">{action}</CardFooter> : null}
    </Card>
  );
}
