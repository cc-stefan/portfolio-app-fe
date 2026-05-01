import { MetricCard } from "../../components/metric-card";
import type { PortfolioDictionary } from "../../i18n/types";
import type {
  ApiResult,
  PortfolioHealth,
  PortfolioProject,
} from "../../model/types";

interface HomeMetricsProps {
  copy: PortfolioDictionary["home"];
  healthResult: ApiResult<PortfolioHealth>;
  projects: PortfolioProject[];
  featuredProjects: PortfolioProject[];
  technologies: string[];
  apiBaseUrl: string;
}

function formatCount(value?: number) {
  return String(value ?? 0);
}

export function HomeMetrics({
  copy,
  healthResult,
  projects,
  featuredProjects,
  technologies,
  apiBaseUrl,
}: HomeMetricsProps) {
  const isOnline = healthResult.ok && healthResult.data?.status.toLowerCase() === "ok";
  const statusLabel =
    healthResult.status === null
      ? copy.statusUnavailable
      : isOnline
        ? copy.statusOnline
        : copy.statusOffline;

  return (
    <section
      aria-label="Portfolio metrics"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      <MetricCard
        label={copy.metrics.projects}
        value={formatCount(projects.length)}
        detail={copy.showcaseLabel}
      />
      <MetricCard
        label={copy.metrics.featured}
        value={formatCount(featuredProjects.length)}
        detail={copy.featuredTab}
        tone="accent"
      />
      <MetricCard
        label={copy.metrics.technologies}
        value={formatCount(technologies.length)}
        detail={technologies.slice(0, 4).join(", ") || copy.metrics.technologies}
      />
      <MetricCard
        label={copy.metrics.status}
        value={statusLabel}
        detail={apiBaseUrl}
        tone={isOnline ? "success" : "warning"}
      />
    </section>
  );
}
