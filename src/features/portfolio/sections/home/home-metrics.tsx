import { MetricCard } from '../../components/metric-card';
import type { PortfolioDictionary } from '../../i18n/types';

interface HomeMetricsProps {
  copy: PortfolioDictionary['home'];
}

export function HomeMetrics({ copy }: HomeMetricsProps) {
  return (
    <section aria-label={copy.metrics.ariaLabel} className="metrics-rail">
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
