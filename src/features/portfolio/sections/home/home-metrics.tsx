import { MetricCard } from "../../components/metric-card";
import type { PortfolioDictionary } from "../../i18n/types";

interface HomeMetricsProps {
  copy: PortfolioDictionary["home"];
}

export function HomeMetrics({ copy }: HomeMetricsProps) {
  return (
    <section
      aria-label="Portfolio metrics"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {copy.metricCards.map((metric) => (
        <MetricCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
          detail={metric.detail}
        />
      ))}
    </section>
  );
}
