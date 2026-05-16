import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  label: string;
  value: string;
  detail?: string;
}

export function MetricCard({ label, value, detail }: MetricCardProps) {
  return (
    <Card variant="solid" className="h-full overflow-hidden">
      <CardContent className="h-full flex flex-col justify-between p-5 sm:p-6">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="mt-5 text-balance text-[1.75rem] font-semibold leading-[1.12] text-foreground sm:text-3xl">
          {value}
        </p>
        {detail ? (
          <p className="mt-5 text-pretty text-sm leading-6 text-muted-foreground">
            {detail}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
