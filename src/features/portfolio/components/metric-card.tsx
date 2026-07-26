interface MetricCardProps {
  label: string;
  value: string;
  detail?: string;
}

export function MetricCard({ label, value, detail }: MetricCardProps) {
  return (
    <article className="metric-tile flex flex-col justify-between">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="metric-value mt-5 text-balance font-semibold text-foreground">{value}</p>
      {detail ? (
        <p className="mt-4 text-pretty text-sm leading-6 text-muted-foreground">{detail}</p>
      ) : null}
    </article>
  );
}
