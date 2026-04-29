import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  label: string;
  value: string;
  detail?: string;
  tone?: "default" | "accent" | "success" | "warning";
}

export function MetricCard({
  label,
  value,
  detail,
  tone = "default",
}: MetricCardProps) {
  const badgeVariant =
    tone === "success"
      ? "success"
      : tone === "warning"
        ? "warning"
        : tone === "accent"
          ? "accent"
          : "outline";

  return (
    <Card variant="solid" className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <Badge variant={badgeVariant}>{tone === "default" ? "Signal" : tone}</Badge>
        </div>
        <p className="mt-7 text-3xl font-semibold text-foreground">{value}</p>
        {detail ? (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {detail}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
