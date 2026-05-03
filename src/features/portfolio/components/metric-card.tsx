import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  label: string;
  value: string;
  detail?: string;
}

export function MetricCard({
  label,
  value,
  detail,
}: MetricCardProps) {
  return (
    <Card variant="solid" className="h-full overflow-hidden">
      <CardContent className="flex min-h-[13.5rem] flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
        </div>
        <p className="mt-7 text-3xl font-semibold leading-tight text-foreground">
          {value}
        </p>
        {detail ? (
          <p className="mt-auto pt-4 text-pretty text-sm leading-6 text-muted-foreground">
            {detail}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
