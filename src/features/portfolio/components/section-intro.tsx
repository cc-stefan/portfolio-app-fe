import { cn } from '@/lib/utils';

interface SectionIntroProps {
  label: string;
  title: string;
  description: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionIntro({
  label,
  title,
  description,
  align = 'left',
  className,
}: SectionIntroProps) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      <p className={cn('section-kicker', align === 'center' && 'justify-center')}>{label}</p>
      <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.04em] text-foreground sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
        {description}
      </p>
    </div>
  );
}
